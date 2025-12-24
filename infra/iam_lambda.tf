resource "aws_iam_role" "lambda_role" {
  name = "asc-ftv-${terraform.workspace}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow"
        Action = "sts:AssumeRole"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(
    local.default_tags,
    {
      Name = "asc-ftv-${terraform.workspace}-lambda-role"
    }
  )
}
