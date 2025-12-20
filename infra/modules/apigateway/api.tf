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
