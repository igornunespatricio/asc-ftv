# ---------------------------------------------------------
# /users/{id}
# ---------------------------------------------------------

resource "aws_api_gateway_resource" "user_id" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.users.id
  path_part   = "{id}"
}

# PUT /users/{id}
resource "aws_api_gateway_method" "user_put" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.user_id.id
  http_method   = "PUT"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.jwt.id
}

resource "aws_api_gateway_integration" "user_put" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.user_id.id
  http_method             = aws_api_gateway_method.user_put.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = local.lambda_invoke_uris["update_user"]
}

# DELETE /users/{id}
resource "aws_api_gateway_method" "user_delete" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.user_id.id
  http_method   = "DELETE"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.jwt.id
}

resource "aws_api_gateway_integration" "user_delete" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.user_id.id
  http_method             = aws_api_gateway_method.user_delete.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = local.lambda_invoke_uris["delete_user"]
}

# OPTIONS /users/{id}
resource "aws_api_gateway_method" "user_id_options" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.user_id.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "user_id_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.user_id.id
  http_method = aws_api_gateway_method.user_id_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "user_id_options" {
  rest_api_id         = aws_api_gateway_rest_api.this.id
  resource_id         = aws_api_gateway_resource.user_id.id
  http_method         = aws_api_gateway_method.user_id_options.http_method
  status_code         = "200"
  response_parameters = local.cors_headers
}

resource "aws_api_gateway_integration_response" "user_id_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.user_id.id
  http_method = aws_api_gateway_method.user_id_options.http_method
  status_code = "200"

  response_parameters = merge(
    local.cors_integration_headers,
    {
      "method.response.header.Access-Control-Allow-Methods" = "'PUT,DELETE,OPTIONS'"
    }
  )

  depends_on = [aws_api_gateway_integration.user_id_options]
}
