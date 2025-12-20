# ---------------------------------------------------------
# /players
# ---------------------------------------------------------

resource "aws_api_gateway_resource" "players" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "players"
}

# ---------------------------------------------------------
# GET /players  (List players)
# ---------------------------------------------------------

resource "aws_api_gateway_method" "players_get" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.players.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "players_get" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.players.id
  http_method             = aws_api_gateway_method.players_get.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = var.lambdas["list_players"]
}

# ---------------------------------------------------------
# POST /players  (Create player)
# ---------------------------------------------------------

resource "aws_api_gateway_method" "players_post" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.players.id
  http_method   = "POST"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.jwt.id
}

resource "aws_api_gateway_integration" "players_post" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.players.id
  http_method             = aws_api_gateway_method.players_post.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = var.lambdas["create_player"]
}

# ---------------------------------------------------------
# /players/{id}
# ---------------------------------------------------------

resource "aws_api_gateway_resource" "player_id" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.players.id
  path_part   = "{id}"
}

# ---------------------------------------------------------
# PUT /players/{id}  (Update player)
# ---------------------------------------------------------

resource "aws_api_gateway_method" "player_put" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.player_id.id
  http_method   = "PUT"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.jwt.id
}

resource "aws_api_gateway_integration" "player_put" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.player_id.id
  http_method             = aws_api_gateway_method.player_put.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = var.lambdas["update_player"]
}

# ---------------------------------------------------------
# DELETE /players/{id}  (Delete player)
# ---------------------------------------------------------

resource "aws_api_gateway_method" "player_delete" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.player_id.id
  http_method   = "DELETE"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.jwt.id
}

resource "aws_api_gateway_integration" "player_delete" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.player_id.id
  http_method             = aws_api_gateway_method.player_delete.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = var.lambdas["delete_player"]
}

resource "aws_api_gateway_method" "players_options" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.players.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "players_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.players.id
  http_method = aws_api_gateway_method.players_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "players_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.players.id
  http_method = aws_api_gateway_method.players_options.http_method
  status_code = "200"

  response_parameters = local.cors_headers
}

resource "aws_api_gateway_integration_response" "players_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.players.id
  http_method = aws_api_gateway_method.players_options.http_method
  status_code = "200"

  response_parameters = merge(
    local.cors_integration_headers,
    {
      "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
    }
  )
}

resource "aws_api_gateway_method" "player_id_options" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.player_id.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "player_id_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.player_id.id
  http_method = aws_api_gateway_method.player_id_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "player_id_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.player_id.id
  http_method = aws_api_gateway_method.player_id_options.http_method
  status_code = "200"

  response_parameters = local.cors_headers
}

resource "aws_api_gateway_integration_response" "player_id_options" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.player_id.id
  http_method = aws_api_gateway_method.player_id_options.http_method
  status_code = "200"

  response_parameters = merge(
    local.cors_integration_headers,
    {
      "method.response.header.Access-Control-Allow-Methods" = "'PUT,DELETE,OPTIONS'"
    }
  )
}
