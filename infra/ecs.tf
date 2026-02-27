resource "aws_ecs_cluster" "main" {
  name = var.project

  setting {
    name  = "containerInsights"
    value = "disabled" # Cost savings for low traffic
  }

  tags = { Name = var.project }
}

# --- Task Definition ---

resource "aws_ecs_task_definition" "api" {
  family                   = "${var.project}-api"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256 # 0.25 vCPU
  memory                   = 512 # 512 MB
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name  = "api"
    image = "${aws_ecr_repository.api.repository_url}:latest"

    portMappings = [{
      containerPort = 8000
      protocol      = "tcp"
    }]

    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }

    environment = [
      { name = "APP_ENV", value = "production" },
      { name = "LOG_LEVEL", value = "INFO" },
      { name = "LLM_PROVIDER", value = "openai" },
      { name = "LLM_MODEL", value = "gpt-4o-mini" },
      { name = "LLM_TEMPERATURE", value = "0.3" },
      { name = "LLM_MAX_TOKENS", value = "4096" },
      { name = "LLM_TIMEOUT", value = "60" },
      { name = "OPENAI_REALTIME_MODEL", value = "gpt-4o-mini-realtime-preview" },
      { name = "OPENAI_REALTIME_VOICE", value = "alloy" },
      { name = "JWT_ALGORITHM", value = "HS256" },
      { name = "JWT_EXPIRE_MINUTES", value = "1440" },
      { name = "RESEND_FROM_EMAIL", value = "RoleSignal <noreply@rolesignal.com>" },
    ]

    secrets = [
      { name = "DATABASE_URL", valueFrom = aws_ssm_parameter.database_url.arn },
      { name = "SECRET_KEY", valueFrom = aws_ssm_parameter.secret_key.arn },
      { name = "OPENAI_API_KEY", valueFrom = aws_ssm_parameter.openai_api_key.arn },
      { name = "OPENAI_REALTIME_API_KEY", valueFrom = aws_ssm_parameter.openai_realtime_api_key.arn },
      { name = "GOOGLE_CLIENT_ID", valueFrom = aws_ssm_parameter.google_client_id.arn },
      { name = "GOOGLE_CLIENT_SECRET", valueFrom = aws_ssm_parameter.google_client_secret.arn },
      { name = "RESEND_API_KEY", valueFrom = aws_ssm_parameter.resend_api_key.arn },
      { name = "CORS_ORIGINS", valueFrom = aws_ssm_parameter.cors_origins.arn },
      { name = "FRONTEND_URL", valueFrom = aws_ssm_parameter.frontend_url.arn },
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ecs_api.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "api"
      }
    }
  }])

  tags = { Name = "${var.project}-api" }
}

# --- Service ---

resource "aws_ecs_service" "api" {
  name            = "${var.project}-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets          = [aws_subnet.public_a.id, aws_subnet.public_b.id]
    security_groups  = [aws_security_group.fargate.id]
    assign_public_ip = true # No NAT Gateway — tasks need public IP for internet
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 8000
  }

  enable_execute_command = true

  lifecycle {
    ignore_changes = [task_definition] # CI/CD updates this
  }

  tags = { Name = "${var.project}-api" }
}

# --- Auto Scaling ---

resource "aws_appautoscaling_target" "ecs" {
  max_capacity       = 3
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.api.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "cpu" {
  name               = "${var.project}-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value = 70.0

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
