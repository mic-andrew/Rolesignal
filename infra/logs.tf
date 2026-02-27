resource "aws_cloudwatch_log_group" "ecs_api" {
  name              = "/ecs/${var.project}-api"
  retention_in_days = 30

  tags = { Name = "${var.project}-api-logs" }
}
