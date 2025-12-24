resource "aws_api_gateway_authorizer" "jwt" {
  name        = "jwt-authorizer"
  rest_api_id = aws_api_gateway_rest_api.this.id
  type        = "REQUEST"

  authorizer_uri = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${var.lambdas["jwt_authorizer"]}/invocations"

  identity_source = "method.request.header.Authorization"

}
