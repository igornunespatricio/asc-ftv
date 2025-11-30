# DynamoDB Table
resource "aws_dynamodb_table" "games" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  # Primary key
  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "Futevolei Games"
  }
}
