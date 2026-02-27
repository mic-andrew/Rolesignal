variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Project name used for resource naming"
  type        = string
  default     = "rolesignal"
}

variable "db_password" {
  description = "RDS master password"
  type        = string
  sensitive   = true
}

variable "alert_email" {
  description = "Email address for CloudWatch alarm notifications"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository in format 'owner/repo' for OIDC trust"
  type        = string
  default     = "mic-andrew/Rolesignal"
}
