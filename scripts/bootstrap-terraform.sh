#!/bin/bash
# bootstrap-terraform.sh — Run once to create Terraform state backend resources
# These resources must exist before `terraform init` can use them.
#
# Usage:
#   chmod +x scripts/bootstrap-terraform.sh
#   ./scripts/bootstrap-terraform.sh [region]

set -euo pipefail

# Disable AWS CLI pager (prevents output getting stuck in 'less')
export AWS_PAGER=""

REGION="${1:-us-east-1}"
STATE_BUCKET="rolesignal-terraform-state"
LOCK_TABLE="rolesignal-terraform-locks"

echo "==> Creating Terraform state bucket: ${STATE_BUCKET} in ${REGION}"

if aws s3api head-bucket --bucket "${STATE_BUCKET}" 2>/dev/null; then
  echo "    Bucket already exists, skipping."
else
  aws s3api create-bucket \
    --bucket "${STATE_BUCKET}" \
    --region "${REGION}"

  aws s3api put-bucket-versioning \
    --bucket "${STATE_BUCKET}" \
    --versioning-configuration Status=Enabled

  aws s3api put-bucket-encryption \
    --bucket "${STATE_BUCKET}" \
    --server-side-encryption-configuration '{
      "Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]
    }'

  aws s3api put-public-access-block \
    --bucket "${STATE_BUCKET}" \
    --public-access-block-configuration \
      BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

  echo "    Bucket created."
fi

echo "==> Creating DynamoDB lock table: ${LOCK_TABLE} in ${REGION}"

if aws dynamodb describe-table --table-name "${LOCK_TABLE}" --region "${REGION}" >/dev/null 2>&1; then
  echo "    Table already exists, skipping."
else
  aws dynamodb create-table \
    --table-name "${LOCK_TABLE}" \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region "${REGION}"

  echo "    Waiting for table to become active..."
  aws dynamodb wait table-exists --table-name "${LOCK_TABLE}" --region "${REGION}"
  echo "    Table created."
fi

echo ""
echo "==> Bootstrap complete. You can now run:"
echo "    cd infra && terraform init"
