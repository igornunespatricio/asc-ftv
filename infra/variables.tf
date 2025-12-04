variable "aws_region" {
  default = "us-east-1"
}

variable "dynamodb_table_name" {
  default = "futevolei-games"
}

variable "website_bucket" {
  description = "Bucket name for website hosting"
  default     = "futevolei-website"
  type        = string
}

variable "dynamodb_table_v2_name" {
  type        = string
  description = "Nome da tabela DynamoDB versão 2"
  default     = "futevolei-games-v2"
}
