resource "aws_iam_role" "apigw_cloudwatch_role" {
  name = "asc-ftv-${terraform.workspace}-apigw-cloudwatch-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = merge(
    local.default_tags,
    {
      Name = "asc-ftv-${terraform.workspace}-apigw-cloudwatch-role"
    }
  )
}
