output "cloudfront_domain" {
  description = "CloudFront distribution domain name (your app URL)"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (needed for CI/CD cache invalidation)"
  value       = aws_cloudfront_distribution.main.id
}

output "alb_dns" {
  description = "ALB DNS name"
  value       = aws_lb.api.dns_name
}

output "ecr_repository_url" {
  description = "ECR repository URL for Docker push"
  value       = aws_ecr_repository.api.repository_url
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.api.name
}

output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions OIDC"
  value       = aws_iam_role.github_actions.arn
}

output "frontend_bucket" {
  description = "S3 bucket name for frontend"
  value       = aws_s3_bucket.frontend.id
}
