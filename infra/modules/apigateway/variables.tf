variable "default_tags" {
  type = map(string)
}


variable "cloudwatch_role_arn" {
  type = string
}

variable "lambdas" {
  description = "Map of Lambda ARNs used by API Gateway"
  type        = map(string)
}

