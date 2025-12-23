resource "aws_iam_policy" "lambda_dynamodb" {
  name = "asc-ftv-${terraform.workspace}-lambda-dynamodb"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          module.games_table.table_arn,
          "${module.games_table.table_arn}/index/*",

          module.users_table.table_arn
        ]
      }
    ]
  })

  tags = local.default_tags
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb.arn
}
