resource "aws_api_gateway_authorizer" "jwt" {
  name            = "jwt-authorizer"
  rest_api_id     = aws_api_gateway_rest_api.this.id
  type            = "REQUEST"
  authorizer_uri  = var.lambdas["jwt_authorizer"]
  identity_source = "method.request.header.Authorization"
}
