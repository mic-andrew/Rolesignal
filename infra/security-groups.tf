# --- ALB Security Group ---
# Only accepts traffic from CloudFront (no direct public access)

resource "aws_security_group" "alb" {
  name_prefix = "${var.project}-alb-"
  description = "ALB - inbound from CloudFront only"
  vpc_id      = aws_vpc.main.id

  tags = { Name = "${var.project}-alb-sg" }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_vpc_security_group_ingress_rule" "alb_cloudfront" {
  security_group_id = aws_security_group.alb.id
  description       = "HTTP from CloudFront"
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"
  prefix_list_id    = data.aws_ec2_managed_prefix_list.cloudfront.id
}

resource "aws_vpc_security_group_egress_rule" "alb_to_fargate" {
  security_group_id            = aws_security_group.alb.id
  description                  = "To Fargate containers"
  from_port                    = 8000
  to_port                      = 8000
  ip_protocol                  = "tcp"
  referenced_security_group_id = aws_security_group.fargate.id
}

# --- Fargate Security Group ---
# Inbound only from ALB. Outbound to internet (APIs) and RDS.

resource "aws_security_group" "fargate" {
  name_prefix = "${var.project}-fargate-"
  description = "Fargate - inbound from ALB only"
  vpc_id      = aws_vpc.main.id

  tags = { Name = "${var.project}-fargate-sg" }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_vpc_security_group_ingress_rule" "fargate_from_alb" {
  security_group_id            = aws_security_group.fargate.id
  description                  = "From ALB"
  from_port                    = 8000
  to_port                      = 8000
  ip_protocol                  = "tcp"
  referenced_security_group_id = aws_security_group.alb.id
}

resource "aws_vpc_security_group_egress_rule" "fargate_to_internet" {
  security_group_id = aws_security_group.fargate.id
  description       = "HTTPS to internet (OpenAI, Resend, Google APIs)"
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
}

resource "aws_vpc_security_group_egress_rule" "fargate_to_rds" {
  security_group_id            = aws_security_group.fargate.id
  description                  = "To RDS PostgreSQL"
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
  referenced_security_group_id = aws_security_group.rds.id
}

# --- RDS Security Group ---
# Inbound only from Fargate. No outbound needed.

resource "aws_security_group" "rds" {
  name_prefix = "${var.project}-rds-"
  description = "RDS - inbound from Fargate only"
  vpc_id      = aws_vpc.main.id

  tags = { Name = "${var.project}-rds-sg" }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_vpc_security_group_ingress_rule" "rds_from_fargate" {
  security_group_id            = aws_security_group.rds.id
  description                  = "PostgreSQL from Fargate"
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
  referenced_security_group_id = aws_security_group.fargate.id
}
