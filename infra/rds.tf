resource "aws_db_subnet_group" "main" {
  name       = "${var.project}-db-subnet"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]

  tags = { Name = "${var.project}-db-subnet" }
}

resource "aws_db_parameter_group" "pg16" {
  family = "postgres16"
  name   = "${var.project}-pg16"

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }

  parameter {
    name         = "shared_preload_libraries"
    value        = "pg_stat_statements"
    apply_method = "pending-reboot"
  }

  tags = { Name = "${var.project}-pg16" }
}

resource "aws_db_instance" "main" {
  identifier = "${var.project}-db"

  engine         = "postgres"
  engine_version = "16.4"
  instance_class = "db.t4g.micro" # Free tier eligible

  allocated_storage     = 20    # Free tier: 20 GB
  max_allocated_storage = 20    # No auto-scale (stay within free tier)
  storage_type          = "gp3"

  db_name  = "rolesignal"
  username = "rolesignal"
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.pg16.name

  multi_az            = false
  publicly_accessible = false

  backup_retention_period = 1 # Free tier limit
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"

  skip_final_snapshot       = false
  final_snapshot_identifier = "${var.project}-final-snapshot"

  deletion_protection = true

  performance_insights_enabled = false

  tags = { Name = "${var.project}-db" }

  lifecycle {
    prevent_destroy = true
  }
}
