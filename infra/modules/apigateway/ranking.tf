# ---------------------------------------------------------
# /ranking
# ---------------------------------------------------------

resource "aws_api_gateway_resource" "ranking" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.api.id
  path_part   = "ranking"
}

# GET /ranking
resource "aws_api_gateway_method" "ranking_get" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.ranking.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "ranking_get" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.ranking.id
  http_method             = aws_api_gateway_method.ranking_get.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = local.lambda_invoke_uris["get_ranking_month"]
}

# OPTIONS /ranking
resource "aws_api_gateway_method" "ranking_options" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.ranking.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "ranking_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.ranking.id
  http_method = aws_api_gateway_method.ranking_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "ranking_options" {
  rest_api_id         = aws_api_gateway_rest_api.this.id
  resource_id         = aws_api_gateway_resource.ranking.id
  http_method         = aws_api_gateway_method.ranking_options.http_method
  status_code         = "200"
  response_parameters = local.cors_headers
}

resource "aws_api_gateway_integration_response" "ranking_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.ranking.id
  http_method = aws_api_gateway_method.ranking_options.http_method
  status_code = "200"

  response_parameters = merge(
    local.cors_integration_headers,
    {
      "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
    }
  )

  depends_on = [aws_api_gateway_integration.ranking_options]
}
