# ---------------------------------------------------------
# /users
# ---------------------------------------------------------

resource "aws_api_gateway_resource" "users" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.api.id
  path_part   = "users"
}

# GET /users
resource "aws_api_gateway_method" "users_get" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.users.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "users_get" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.users.id
  http_method             = aws_api_gateway_method.users_get.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = local.lambda_invoke_uris["list_users"]
}

# POST /users - Protected endpoint
# Requires JWT authentication
# Allows: admin (user creation)
# Rejects: game_inputer, invalid roles
resource "aws_api_gateway_method" "users_post" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.users.id
  http_method   = "POST"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.jwt.id
}

resource "aws_api_gateway_integration" "users_post" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.users.id
  http_method             = aws_api_gateway_method.users_post.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = local.lambda_invoke_uris["create_user"]
}

# OPTIONS /users
resource "aws_api_gateway_method" "users_options" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.users.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "users_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.users.id
  http_method = aws_api_gateway_method.users_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "users_options" {
  rest_api_id         = aws_api_gateway_rest_api.this.id
  resource_id         = aws_api_gateway_resource.users.id
  http_method         = aws_api_gateway_method.users_options.http_method
  status_code         = "200"
  response_parameters = local.cors_headers
}

resource "aws_api_gateway_integration_response" "users_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.users.id
  http_method = aws_api_gateway_method.users_options.http_method
  status_code = "200"

  response_parameters = merge(
    local.cors_integration_headers,
    {
      "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
    }
  )

  depends_on = [
    aws_api_gateway_integration.users_options
  ]
}
