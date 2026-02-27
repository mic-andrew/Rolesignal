#!/bin/bash
# =============================================================================
# setup-production.sh — One-command production setup for RoleSignal
#
# This script does EVERYTHING:
#   1. Bootstraps Terraform state (S3 + DynamoDB)
#   2. Runs terraform init + apply (creates all AWS infrastructure)
#   3. Pushes all secrets to SSM Parameter Store
#   4. Configures GitHub repo variables for CI/CD
#   5. Builds and pushes the initial Docker image to ECR
#   6. Runs database migrations
#   7. Deploys the frontend to S3 + CloudFront
#   8. Starts the ECS service
#
# Prerequisites:
#   - AWS CLI configured (aws configure)
#   - Terraform installed (brew install terraform)
#   - GitHub CLI authenticated (gh auth login)
#   - Docker running
#   - Node.js 20+ installed
#   - infra/terraform.tfvars filled in (copy from terraform.tfvars.example)
#   - server/.env.production filled in (copy from .env.example, set real values)
#
# Usage:
#   chmod +x scripts/setup-production.sh
#   ./scripts/setup-production.sh
# =============================================================================

set -euo pipefail

# Disable AWS CLI pager (prevents output getting stuck in 'less')
export AWS_PAGER=""

REGION="us-east-1"
PROJECT="rolesignal"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
INFRA_DIR="$ROOT_DIR/infra"
SERVER_DIR="$ROOT_DIR/server"
CLIENT_DIR="$ROOT_DIR/client"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }
step()  { echo -e "\n${BLUE}==>${NC} $1"; }

# =============================================================================
# Pre-flight checks
# =============================================================================

step "Running pre-flight checks..."

# Check required tools
command -v aws >/dev/null 2>&1 || error "AWS CLI not found. Install: brew install awscli"
command -v terraform >/dev/null 2>&1 || error "Terraform not found. Install: brew install terraform"
command -v gh >/dev/null 2>&1 || error "GitHub CLI not found. Install: brew install gh"
command -v docker >/dev/null 2>&1 || error "Docker not found. Install Docker Desktop."
command -v node >/dev/null 2>&1 || error "Node.js not found. Install: brew install node"

# Check Docker is running
docker info >/dev/null 2>&1 || error "Docker is not running. Start Docker Desktop."

# Check AWS credentials
aws sts get-caller-identity >/dev/null 2>&1 || error "AWS not configured. Run: aws configure"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
log "AWS Account: $AWS_ACCOUNT_ID"

# Check GitHub CLI auth
gh auth status >/dev/null 2>&1 || error "GitHub CLI not authenticated. Run: gh auth login"
log "GitHub CLI authenticated"

# Check terraform.tfvars exists
[ -f "$INFRA_DIR/terraform.tfvars" ] || error "Missing infra/terraform.tfvars. Copy from terraform.tfvars.example and fill in values."
log "terraform.tfvars found"

# Check .env.production exists
[ -f "$SERVER_DIR/.env.production" ] || error "Missing server/.env.production. Copy from .env.example and fill in real API keys."
log ".env.production found"

# Read db_password from terraform.tfvars
DB_PASSWORD=$(grep 'db_password' "$INFRA_DIR/terraform.tfvars" | sed 's/.*= *"\(.*\)"/\1/')
[ -n "$DB_PASSWORD" ] && [ "$DB_PASSWORD" != "your-strong-database-password-here" ] || error "Set a real db_password in infra/terraform.tfvars"
log "All pre-flight checks passed"

# =============================================================================
# Step 1: Bootstrap Terraform state backend
# =============================================================================

step "Step 1/8: Bootstrapping Terraform state backend..."

bash "$ROOT_DIR/scripts/bootstrap-terraform.sh" "$REGION"
log "State backend ready"

# =============================================================================
# Step 2: Terraform init + apply
# =============================================================================

step "Step 2/8: Creating AWS infrastructure with Terraform..."

cd "$INFRA_DIR"
terraform init -input=false
terraform apply -auto-approve -input=false

# Capture outputs
CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_domain)
CLOUDFRONT_DIST_ID=$(terraform output -raw cloudfront_distribution_id)
ALB_DNS=$(terraform output -raw alb_dns)
ECR_REPO_URL=$(terraform output -raw ecr_repository_url)
RDS_ENDPOINT=$(terraform output -raw rds_endpoint)
ECS_CLUSTER=$(terraform output -raw ecs_cluster_name)
ECS_SERVICE=$(terraform output -raw ecs_service_name)
FRONTEND_BUCKET=$(terraform output -raw frontend_bucket)
GH_ROLE_ARN=$(terraform output -raw github_actions_role_arn)

log "Infrastructure created"
log "CloudFront: https://$CLOUDFRONT_DOMAIN"

# =============================================================================
# Step 3: Push secrets to SSM Parameter Store
# =============================================================================

step "Step 3/8: Pushing secrets to SSM Parameter Store..."

# Source the .env.production file
set -a
source "$SERVER_DIR/.env.production"
set +a

# Build the DATABASE_URL from Terraform outputs
PROD_DATABASE_URL="postgresql+asyncpg://rolesignal:${DB_PASSWORD}@${RDS_ENDPOINT}/rolesignal"

# Push each secret to SSM
push_ssm() {
  local name="$1"
  local value="$2"
  aws ssm put-parameter \
    --name "/${PROJECT}/prod/${name}" \
    --value "$value" \
    --type SecureString \
    --overwrite \
    --region "$REGION" >/dev/null 2>&1
  log "  Set /${PROJECT}/prod/${name}"
}

push_ssm "DATABASE_URL" "$PROD_DATABASE_URL"
push_ssm "SECRET_KEY" "$(openssl rand -hex 32)"
push_ssm "OPENAI_API_KEY" "${OPENAI_API_KEY:?Set OPENAI_API_KEY in .env.production}"
push_ssm "OPENAI_REALTIME_API_KEY" "${OPENAI_REALTIME_API_KEY:?Set OPENAI_REALTIME_API_KEY in .env.production}"
push_ssm "RESEND_API_KEY" "${RESEND_API_KEY:?Set RESEND_API_KEY in .env.production}"
push_ssm "CORS_ORIGINS" "[\"https://${CLOUDFRONT_DOMAIN}\"]"
push_ssm "FRONTEND_URL" "https://${CLOUDFRONT_DOMAIN}"

# Google OAuth is optional — only push if keys are provided
if [ -n "${GOOGLE_CLIENT_ID:-}" ]; then
  push_ssm "GOOGLE_CLIENT_ID" "$GOOGLE_CLIENT_ID"
  push_ssm "GOOGLE_CLIENT_SECRET" "${GOOGLE_CLIENT_SECRET:-}"
  log "Google OAuth configured"
else
  push_ssm "GOOGLE_CLIENT_ID" "not-configured"
  push_ssm "GOOGLE_CLIENT_SECRET" "not-configured"
  warn "Google OAuth not configured (no GOOGLE_CLIENT_ID). Email/password login still works."
fi

log "All secrets pushed to SSM"

# =============================================================================
# Step 4: Configure GitHub repo variables for CI/CD
# =============================================================================

step "Step 4/8: Configuring GitHub repo for CI/CD..."

GITHUB_REPO=$(grep 'github_repo' "$INFRA_DIR/terraform.tfvars" | sed 's/.*= *"\(.*\)"/\1/')

gh variable set AWS_ROLE_ARN --body "$GH_ROLE_ARN" --repo "$GITHUB_REPO"
gh variable set CLOUDFRONT_DISTRIBUTION_ID --body "$CLOUDFRONT_DIST_ID" --repo "$GITHUB_REPO"
gh variable set FRONTEND_BUCKET --body "$FRONTEND_BUCKET" --repo "$GITHUB_REPO"

log "GitHub variables set: AWS_ROLE_ARN, CLOUDFRONT_DISTRIBUTION_ID, FRONTEND_BUCKET"

# =============================================================================
# Step 5: Build and push initial Docker image
# =============================================================================

step "Step 5/8: Building and pushing Docker image to ECR..."

aws ecr get-login-password --region "$REGION" | \
  docker login --username AWS --password-stdin "${ECR_REPO_URL%%/*}"

docker build \
  -t "$ECR_REPO_URL:latest" \
  -t "$ECR_REPO_URL:initial" \
  -f "$SERVER_DIR/Dockerfile" "$SERVER_DIR"

docker push "$ECR_REPO_URL:latest"
docker push "$ECR_REPO_URL:initial"

log "Docker image pushed to ECR"

# =============================================================================
# Step 6: Run database migrations
# =============================================================================

step "Step 6/8: Running database migrations..."

# Get network config from the ECS service
NETWORK_CONFIG=$(aws ecs describe-services \
  --cluster "$ECS_CLUSTER" \
  --services "$ECS_SERVICE" \
  --region "$REGION" \
  --query 'services[0].networkConfiguration' --output json)

# Run migration as one-off task
TASK_ARN=$(aws ecs run-task \
  --cluster "$ECS_CLUSTER" \
  --task-definition "${PROJECT}-api" \
  --launch-type FARGATE \
  --network-configuration "$NETWORK_CONFIG" \
  --overrides "{
    \"containerOverrides\": [{
      \"name\": \"api\",
      \"command\": [\"alembic\", \"upgrade\", \"head\"]
    }]
  }" \
  --region "$REGION" \
  --query 'tasks[0].taskArn' --output text)

echo "  Migration task: $TASK_ARN"
echo "  Waiting for migration to complete..."

aws ecs wait tasks-stopped --cluster "$ECS_CLUSTER" --tasks "$TASK_ARN" --region "$REGION"

EXIT_CODE=$(aws ecs describe-tasks \
  --cluster "$ECS_CLUSTER" \
  --tasks "$TASK_ARN" \
  --region "$REGION" \
  --query 'tasks[0].containers[0].exitCode' --output text)

if [ "$EXIT_CODE" != "0" ]; then
  error "Migration failed with exit code $EXIT_CODE. Check CloudWatch logs at /ecs/${PROJECT}-api"
fi

log "Database migrations completed"

# =============================================================================
# Step 7: Deploy frontend
# =============================================================================

step "Step 7/8: Building and deploying frontend..."

cd "$CLIENT_DIR"
npm ci --silent
VITE_API_BASE_URL="" npm run build

# Sync to S3
aws s3 sync dist/ "s3://$FRONTEND_BUCKET/" \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "*.json"

aws s3 cp dist/index.html "s3://$FRONTEND_BUCKET/index.html" \
  --cache-control "no-cache, no-store, must-revalidate"

# Invalidate CloudFront
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DIST_ID" \
  --paths "/index.html" "/*" \
  --query 'Invalidation.Id' --output text)

log "Frontend deployed, CloudFront invalidation: $INVALIDATION_ID"

# =============================================================================
# Step 8: Force ECS service to pick up the new image
# =============================================================================

step "Step 8/8: Starting ECS service..."

aws ecs update-service \
  --cluster "$ECS_CLUSTER" \
  --service "$ECS_SERVICE" \
  --force-new-deployment \
  --region "$REGION" >/dev/null

echo "  Waiting for service to stabilize (this takes 2-5 minutes)..."
aws ecs wait services-stable --cluster "$ECS_CLUSTER" --services "$ECS_SERVICE" --region "$REGION"

log "ECS service running"

# =============================================================================
# Done!
# =============================================================================

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  RoleSignal is live!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "  App URL:     ${BLUE}https://$CLOUDFRONT_DOMAIN${NC}"
echo -e "  Health:      ${BLUE}https://$CLOUDFRONT_DOMAIN/health${NC}"
echo -e "  API Docs:    ${BLUE}https://$CLOUDFRONT_DOMAIN/api/docs${NC}"
echo ""
echo -e "  ${YELLOW}Next steps:${NC}"
echo -e "  1. Visit the app URL above and verify it works"
echo -e "  2. Update Google OAuth redirect URIs to include: https://$CLOUDFRONT_DOMAIN"
echo -e "  3. From now on, just merge to main — CI/CD handles everything"
echo ""
echo -e "  ${YELLOW}GitHub repo variables set:${NC}"
echo -e "  • AWS_ROLE_ARN = $GH_ROLE_ARN"
echo -e "  • CLOUDFRONT_DISTRIBUTION_ID = $CLOUDFRONT_DIST_ID"
echo -e "  • FRONTEND_BUCKET = $FRONTEND_BUCKET"
echo ""
