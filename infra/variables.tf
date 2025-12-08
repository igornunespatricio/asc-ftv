variable "aws_region" {
  default = "us-east-1"
}

variable "website_bucket" {
  description = "Bucket name for website hosting"
  default     = "futevolei-website"
  type        = string
}

variable "dynamodb_table_name" {
  type        = string
  description = "Nome da tabela DynamoDB"
  default     = "futevolei-games"
}
