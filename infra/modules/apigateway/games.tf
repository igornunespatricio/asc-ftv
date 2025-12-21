resource "aws_api_gateway_resource" "games" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "games"
}

# GET /games
resource "aws_api_gateway_method" "games_get" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.games.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "games_get" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.games.id
  http_method             = aws_api_gateway_method.games_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"

  uri = local.lambda_invoke_uris["get_games"]
}


# POST /games
resource "aws_api_gateway_method" "games_post" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.games.id
  http_method   = "POST"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.jwt.id
}

resource "aws_api_gateway_integration" "games_post" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.games.id
  http_method             = aws_api_gateway_method.games_post.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = local.lambda_invoke_uris["get_games"]
}

resource "aws_api_gateway_method" "games_options" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.games.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "games_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.games.id
  http_method = aws_api_gateway_method.games_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "games_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.games.id
  http_method = aws_api_gateway_method.games_options.http_method
  status_code = "200"

  response_parameters = local.cors_headers
}

resource "aws_api_gateway_integration_response" "games_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.games.id
  http_method = aws_api_gateway_method.games_options.http_method
  status_code = "200"

  response_parameters = merge(
    local.cors_integration_headers,
    {
      "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
    }
  )
}
