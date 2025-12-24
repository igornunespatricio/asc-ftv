resource "aws_api_gateway_rest_api" "this" {
  name        = "${terraform.workspace}-futevolei-api"
  description = "ASC Futevôlei API"

  tags = merge(var.default_tags, {
    Name = "${terraform.workspace}-futevolei-api"
  })
}

resource "aws_api_gateway_account" "this" {
  cloudwatch_role_arn = var.cloudwatch_role_arn

}

resource "aws_api_gateway_resource" "api" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "api"
}
