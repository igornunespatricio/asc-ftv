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
