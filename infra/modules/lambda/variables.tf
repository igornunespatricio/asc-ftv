variable "function_name" {}
variable "role_arn" {}
variable "filename" {}
variable "source_code_hash" {}

variable "handler" {
  default = "index.handler"
}

variable "runtime" {
  default = "nodejs18.x"
}

variable "timeout" {
  default = 10
}

variable "memory_size" {
  default = 128
}

variable "environment_variables" {
  type    = map(string)
  default = {}
}

variable "tags" {
  type    = map(string)
  default = {}
}
