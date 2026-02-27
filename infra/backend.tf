terraform {
  backend "s3" {
    bucket         = "rolesignal-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "rolesignal-terraform-locks"
    encrypt        = true
  }
}
