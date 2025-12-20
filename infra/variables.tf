variable "aws_region" {
  description = "AWS region to deploy all resources"
  type        = string
  default     = "us-east-1"
}

variable "website_bucket" {
  description = "Base name for website hosting bucket (workspace prefix will be added automatically)"
  type        = string
  default     = "futevolei-website"
}

variable "dynamodb_table_name" {
  description = "Base name for DynamoDB table (workspace prefix will be added automatically)"
  type        = string
  default     = "futevolei-games"
}

# Tags base — iguais para todos os ambientes
variable "base_tags" {
  description = "Base tags applied to all resources"
  type        = map(string)

  default = {
    Project   = "futevolei"
    Owner     = "asc-ftv"
    ManagedBy = "terraform"
  }
}

variable "jwt_secret" {
  type        = string
  description = "JWT secret used by authorizer lambda"
  sensitive   = true
}
