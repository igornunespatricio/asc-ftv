#####################################
# /api/login
#####################################

resource "aws_api_gateway_resource" "login" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.api.id
  path_part   = "login"
}

########################
# POST /api/login
########################
resource "aws_api_gateway_method" "login_post" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.login.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "login_post" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.login.id
  http_method             = aws_api_gateway_method.login_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"

  uri = local.lambda_invoke_uris["login_user"]
}

########################
# OPTIONS /api/login
########################
resource "aws_api_gateway_method" "login_options" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.login.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "login_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.login.id
  http_method = aws_api_gateway_method.login_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "login_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.login.id
  http_method = aws_api_gateway_method.login_options.http_method
  status_code = "200"

  response_parameters = local.cors_headers
}

resource "aws_api_gateway_integration_response" "login_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.login.id
  http_method = aws_api_gateway_method.login_options.http_method
  status_code = "200"

  response_parameters = merge(
    local.cors_integration_headers,
    {
      "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    }
  )

  depends_on = [
    aws_api_gateway_integration.login_options
  ]
}
