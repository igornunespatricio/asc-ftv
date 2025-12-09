locals {
  default_tags = merge(
    var.base_tags,
    { Environment = terraform.workspace }
  )
}
