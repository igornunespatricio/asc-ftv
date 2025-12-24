variable "name" {
  description = "DynamoDB table name"
  type        = string
}

variable "billing_mode" {
  type    = string
  default = "PAY_PER_REQUEST"
}

variable "hash_key" {
  description = "Partition key"
  type        = string
}

variable "range_key" {
  description = "Sort key (optional)"
  type        = string
  default     = null
}

variable "attributes" {
  description = "List of attributes"
  type = list(object({
    name = string
    type = string
  }))
}

variable "global_secondary_indexes" {
  description = "Global secondary indexes"
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = optional(string)
    projection_type = string
  }))
  default = []
}

variable "tags" {
  type    = map(string)
  default = {}
}
