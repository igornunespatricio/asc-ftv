resource "aws_dynamodb_table" "games" {
  name         = "asc-ftv-${terraform.workspace}-games"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "pk"
  range_key = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  global_secondary_index {
    name            = "id-index"
    hash_key        = "id"
    projection_type = "ALL"
  }

  tags = merge(
    local.default_tags,
    {
      Name = "asc-ftv-${terraform.workspace}-games"
    }
  )
}
