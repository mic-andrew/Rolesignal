# SSM Parameter Store — each secret is an individual SecureString parameter.
# Terraform creates them with placeholder values.
# Set real values via AWS Console (Parameter Store → edit) or CLI:
#   aws ssm put-parameter --name "/rolesignal/prod/SECRET_KEY" --value "real-value" --type SecureString --overwrite

resource "aws_ssm_parameter" "database_url" {
  name  = "/${var.project}/prod/DATABASE_URL"
  type  = "SecureString"
  value = "postgresql+asyncpg://rolesignal:${var.db_password}@${aws_db_instance.main.endpoint}/rolesignal"

  tags = { Name = "DATABASE_URL" }

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "secret_key" {
  name  = "/${var.project}/prod/SECRET_KEY"
  type  = "SecureString"
  value = "CHANGE_ME" # Set real value via console or CLI

  tags = { Name = "SECRET_KEY" }

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "openai_api_key" {
  name  = "/${var.project}/prod/OPENAI_API_KEY"
  type  = "SecureString"
  value = "CHANGE_ME"

  tags = { Name = "OPENAI_API_KEY" }

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "openai_realtime_api_key" {
  name  = "/${var.project}/prod/OPENAI_REALTIME_API_KEY"
  type  = "SecureString"
  value = "CHANGE_ME"

  tags = { Name = "OPENAI_REALTIME_API_KEY" }

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "google_client_id" {
  name  = "/${var.project}/prod/GOOGLE_CLIENT_ID"
  type  = "SecureString"
  value = "CHANGE_ME"

  tags = { Name = "GOOGLE_CLIENT_ID" }

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "google_client_secret" {
  name  = "/${var.project}/prod/GOOGLE_CLIENT_SECRET"
  type  = "SecureString"
  value = "CHANGE_ME"

  tags = { Name = "GOOGLE_CLIENT_SECRET" }

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "resend_api_key" {
  name  = "/${var.project}/prod/RESEND_API_KEY"
  type  = "SecureString"
  value = "CHANGE_ME"

  tags = { Name = "RESEND_API_KEY" }

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "cors_origins" {
  name  = "/${var.project}/prod/CORS_ORIGINS"
  type  = "SecureString"
  value = "[\"https://placeholder.cloudfront.net\"]" # Update after terraform apply

  tags = { Name = "CORS_ORIGINS" }

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "frontend_url" {
  name  = "/${var.project}/prod/FRONTEND_URL"
  type  = "SecureString"
  value = "https://placeholder.cloudfront.net" # Update after terraform apply

  tags = { Name = "FRONTEND_URL" }

  lifecycle {
    ignore_changes = [value]
  }
}
