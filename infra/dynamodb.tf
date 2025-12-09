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

resource "aws_dynamodb_table" "players" {
  name         = "asc-ftv-${terraform.workspace}-players"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "name"
    type = "S"
  }

  # nickname é opcional e não precisa de index ou key, mas pode ser declarado
  attribute {
    name = "nickname"
    type = "S"
  }

  tags = merge(
    local.default_tags,
    {
      Name = "asc-ftv-${terraform.workspace}-players"
    }
  )
}
