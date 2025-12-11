# API Gateway REST API
resource "aws_api_gateway_rest_api" "api" {
  name        = "${terraform.workspace}-futevolei-api"
  description = "API to manage futevolei games"

  tags = merge(
    local.default_tags,
    {
      Name = "${terraform.workspace}-futevolei-api"
    }
  )
}

resource "aws_api_gateway_resource" "games_resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "games"
}

resource "aws_api_gateway_method" "options_games" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.games_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_games_integration" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.games_resource.id
  http_method = aws_api_gateway_method.options_games.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }

  passthrough_behavior = "WHEN_NO_MATCH"
}

resource "aws_api_gateway_method_response" "options_games_response" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.games_resource.id
  http_method = aws_api_gateway_method.options_games.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "options_games_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.games_resource.id
  http_method = aws_api_gateway_method.options_games.http_method
  status_code = aws_api_gateway_method_response.options_games_response.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'*'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  response_templates = {
    "application/json" = ""
  }
}

resource "aws_api_gateway_method" "post_games" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.games_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "post_games_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.games_resource.id
  http_method             = aws_api_gateway_method.post_games.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.add_game.invoke_arn
}

resource "aws_api_gateway_method" "get_games" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.games_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_games_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.games_resource.id
  http_method             = aws_api_gateway_method.get_games.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.get_games.invoke_arn
}

resource "aws_api_gateway_resource" "ranking_resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "ranking"
}

resource "aws_api_gateway_method" "options_ranking" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.ranking_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_ranking_integration" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.ranking_resource.id
  http_method = aws_api_gateway_method.options_ranking.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }

  passthrough_behavior = "WHEN_NO_MATCH"
}

resource "aws_api_gateway_method_response" "options_ranking_response" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.ranking_resource.id
  http_method = aws_api_gateway_method.options_ranking.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "options_ranking_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.ranking_resource.id
  http_method = aws_api_gateway_method.options_ranking.http_method
  status_code = aws_api_gateway_method_response.options_ranking_response.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'*'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  response_templates = {
    "application/json" = ""
  }
}

resource "aws_api_gateway_method" "get_ranking" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.ranking_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_ranking_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ranking_resource.id
  http_method             = aws_api_gateway_method.get_ranking.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.get_ranking_month.invoke_arn
}

resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  triggers = {
    redeploy = sha1(jsonencode({
      methods = [
        aws_api_gateway_method.post_games.http_method,
        aws_api_gateway_method.options_games.http_method,
        aws_api_gateway_method.get_games.http_method,
        aws_api_gateway_method.get_ranking.http_method,
        aws_api_gateway_method.options_ranking.http_method,

        aws_api_gateway_method.post_players.http_method,
        aws_api_gateway_method.get_players.http_method,
        aws_api_gateway_method.options_players.http_method,
        aws_api_gateway_method.delete_player.http_method,
        aws_api_gateway_method.put_player.http_method,

        aws_api_gateway_method.options_player_id.http_method,
      ]
      integrations = [
        aws_api_gateway_integration.post_games_integration.id,
        aws_api_gateway_integration.options_games_integration.id,
        aws_api_gateway_integration.get_games_integration.id,
        aws_api_gateway_integration.get_ranking_integration.id,
        aws_api_gateway_integration.options_ranking_integration.id,

        aws_api_gateway_integration.post_players_integration.id,
        aws_api_gateway_integration.get_players_integration.id,
        aws_api_gateway_integration.options_players_integration.id,
        aws_api_gateway_integration.delete_player_integration.id,
        aws_api_gateway_integration.put_player_integration.id,

        aws_api_gateway_integration.options_player_id_integration.id,
      ]
    }))
  }


  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_integration.post_games_integration,
    aws_api_gateway_integration.options_games_integration,
    aws_api_gateway_integration.get_games_integration,
    aws_api_gateway_integration.get_ranking_integration,
    aws_api_gateway_integration.options_ranking_integration,

    aws_api_gateway_integration.post_players_integration,
    aws_api_gateway_integration.get_players_integration,
    aws_api_gateway_integration.options_players_integration,
    aws_api_gateway_integration.delete_player_integration,
    aws_api_gateway_integration.put_player_integration,

    aws_api_gateway_integration.options_player_id_integration,
  ]
}

# API Gateway Account
resource "aws_api_gateway_account" "account" {
  cloudwatch_role_arn = aws_iam_role.apigw_cloudwatch_role.arn
}

# Stage
resource "aws_api_gateway_stage" "stage" {
  stage_name    = terraform.workspace
  rest_api_id   = aws_api_gateway_rest_api.api.id
  deployment_id = aws_api_gateway_deployment.api_deployment.id

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw_logs.arn
    format = jsonencode({
      requestId    = "$context.requestId"
      ip           = "$context.identity.sourceIp"
      caller       = "$context.identity.caller"
      user         = "$context.identity.user"
      requestTime  = "$context.requestTime"
      httpMethod   = "$context.httpMethod"
      resourcePath = "$context.resourcePath"
      status       = "$context.status"
      protocol     = "$context.protocol"
    })
  }

  xray_tracing_enabled = true

  tags = merge(
    local.default_tags,
    {
      Name = "${terraform.workspace}-apigw-stage"
    }
  )

  depends_on = [
    aws_api_gateway_account.account,
    aws_cloudwatch_log_group.api_gw_logs
  ]
}

# CloudWatch log group for API Gateway
resource "aws_cloudwatch_log_group" "api_gw_logs" {
  name              = "/aws/apigateway/${terraform.workspace}-futevolei"
  retention_in_days = 14

  tags = merge(
    local.default_tags,
    {
      Name = "${terraform.workspace}-apigw-logs"
    }
  )
}

# ---------------------------------------------------------
# PLAYERS RESOURCE
# ---------------------------------------------------------

resource "aws_api_gateway_resource" "players_resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "players"
}

# ---------------------------------------------------------
# OPTIONS /players (CORS)
# ---------------------------------------------------------

resource "aws_api_gateway_method" "options_players" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.players_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_players_integration" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.players_resource.id
  http_method = aws_api_gateway_method.options_players.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }

  passthrough_behavior = "WHEN_NO_MATCH"
}

resource "aws_api_gateway_method_response" "options_players_response" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.players_resource.id
  http_method = aws_api_gateway_method.options_players.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "options_players_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.players_resource.id
  http_method = aws_api_gateway_method.options_players.http_method
  status_code = aws_api_gateway_method_response.options_players_response.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  response_templates = {
    "application/json" = ""
  }
}


# ---------------------------------------------------------
# POST /players (Create Player)
# ---------------------------------------------------------

resource "aws_api_gateway_method" "post_players" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.players_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "post_players_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.players_resource.id
  http_method             = aws_api_gateway_method.post_players.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.create_player.invoke_arn
}

# ---------------------------------------------------------
# GET /players (List Players)
# ---------------------------------------------------------

resource "aws_api_gateway_method" "get_players" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.players_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_players_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.players_resource.id
  http_method             = aws_api_gateway_method.get_players.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.list_players.invoke_arn
}

# ---------------------------------------------------------
# /players/{id} for DELETE
# ---------------------------------------------------------

resource "aws_api_gateway_resource" "player_id_resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.players_resource.id
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "delete_player" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.player_id_resource.id
  http_method   = "DELETE"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "delete_player_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.player_id_resource.id
  http_method             = aws_api_gateway_method.delete_player.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.delete_player.invoke_arn
}

# ---------------------------------------------------------
# PUT /players/{id} (Update Player)
# ---------------------------------------------------------

resource "aws_api_gateway_method" "put_player" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.player_id_resource.id
  http_method   = "PUT"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "put_player_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.player_id_resource.id
  http_method             = aws_api_gateway_method.put_player.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.update_player.invoke_arn
}

# ---------------------------------------------------------
# OPTIONS /players/{id}  (Required for CORS on PUT/DELETE)
# ---------------------------------------------------------

resource "aws_api_gateway_method" "options_player_id" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.player_id_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_player_id_integration" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.player_id_resource.id
  http_method = aws_api_gateway_method.options_player_id.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }

  passthrough_behavior = "WHEN_NO_MATCH"
}

resource "aws_api_gateway_method_response" "options_player_id_response" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.player_id_resource.id
  http_method = aws_api_gateway_method.options_player_id.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "options_player_id_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.player_id_resource.id
  http_method = aws_api_gateway_method.options_player_id.http_method
  status_code = aws_api_gateway_method_response.options_player_id_response.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'*'"
    "method.response.header.Access-Control-Allow-Methods" = "'PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  response_templates = {
    "application/json" = ""
  }
}
