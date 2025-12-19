# ---------------------------------------------------------
# ADD GAME
# ---------------------------------------------------------
resource "aws_lambda_function" "add_game" {
  function_name = "asc-ftv-${terraform.workspace}-add-game"

  role    = aws_iam_role.lambda_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"

  filename         = "${path.module}/../lambdas/add_game/add_game.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/add_game/add_game.zip")

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.games.name
    }
  }

  tags = merge(
    local.default_tags,
    { Name = "asc-ftv-${terraform.workspace}-add-game" }
  )
}

resource "aws_lambda_permission" "add_game_apigw" {
  statement_id  = "AllowAPIGatewayInvokeAdd"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.add_game.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/${terraform.workspace}/*"
}

# ---------------------------------------------------------
# GET GAMES
# ---------------------------------------------------------
resource "aws_lambda_function" "get_games" {
  function_name = "asc-ftv-${terraform.workspace}-get-games"

  role    = aws_iam_role.lambda_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"

  filename         = "${path.module}/../lambdas/get_games/get_games.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/get_games/get_games.zip")

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.games.name
    }
  }

  tags = merge(
    local.default_tags,
    { Name = "asc-ftv-${terraform.workspace}-get-games" }
  )
}

resource "aws_lambda_permission" "get_games_apigw" {
  statement_id  = "AllowAPIGatewayInvokeGet"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_games.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/${terraform.workspace}/*"
}

# ---------------------------------------------------------
# GET RANKING MONTH
# ---------------------------------------------------------
resource "aws_lambda_function" "get_ranking_month" {
  function_name = "asc-ftv-${terraform.workspace}-get-ranking-month"

  role    = aws_iam_role.lambda_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"

  filename         = "${path.module}/../lambdas/get_ranking_month/get_ranking_month.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/get_ranking_month/get_ranking_month.zip")

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.games.name
    }
  }

  tags = merge(
    local.default_tags,
    { Name = "asc-ftv-${terraform.workspace}-get-ranking-month" }
  )
}

resource "aws_lambda_permission" "get_ranking_apigw" {
  statement_id  = "AllowAPIGatewayInvokeRanking"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_ranking_month.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/${terraform.workspace}/*"
}

# ---------------------------------------------------------
# CREATE PLAYER
# ---------------------------------------------------------

resource "aws_lambda_function" "create_player" {
  function_name = "asc-ftv-${terraform.workspace}-create-player"

  role    = aws_iam_role.lambda_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"

  filename         = "${path.module}/../lambdas/create_player/create_player.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/create_player/create_player.zip")

  environment {
    variables = {
      PLAYERS_TABLE = aws_dynamodb_table.players.name
    }
  }

  tags = merge(
    local.default_tags,
    { Name = "asc-ftv-${terraform.workspace}-create-player" }
  )
}

resource "aws_lambda_permission" "create_player_apigw" {
  statement_id  = "AllowAPIGatewayInvokeCreatePlayer"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_player.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/${terraform.workspace}/*"
}

# ---------------------------------------------------------
# LIST PLAYERS
# ---------------------------------------------------------

resource "aws_lambda_function" "list_players" {
  function_name = "asc-ftv-${terraform.workspace}-list-players"

  role    = aws_iam_role.lambda_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"

  filename         = "${path.module}/../lambdas/list_players/list_players.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/list_players/list_players.zip")

  environment {
    variables = {
      PLAYERS_TABLE = aws_dynamodb_table.players.name
    }
  }

  tags = merge(
    local.default_tags,
    { Name = "asc-ftv-${terraform.workspace}-list-players" }
  )
}

resource "aws_lambda_permission" "list_players_apigw" {
  statement_id  = "AllowAPIGatewayInvokeListPlayers"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list_players.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/${terraform.workspace}/*"
}

# ---------------------------------------------------------
# DELETE PLAYER
# ---------------------------------------------------------

resource "aws_lambda_function" "delete_player" {
  function_name = "asc-ftv-${terraform.workspace}-delete-player"

  role    = aws_iam_role.lambda_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"

  filename         = "${path.module}/../lambdas/delete_player/delete_player.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/delete_player/delete_player.zip")

  environment {
    variables = {
      PLAYERS_TABLE = aws_dynamodb_table.players.name
    }
  }

  tags = merge(
    local.default_tags,
    { Name = "asc-ftv-${terraform.workspace}-delete-player" }
  )
}

resource "aws_lambda_permission" "delete_player_apigw" {
  statement_id  = "AllowAPIGatewayInvokeDeletePlayer"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_player.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/${terraform.workspace}/*"
}

# ---------------------------------------------------------
# UPDATE PLAYER
# ---------------------------------------------------------

resource "aws_lambda_function" "update_player" {
  function_name = "asc-ftv-${terraform.workspace}-update-player"

  role    = aws_iam_role.lambda_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"

  filename         = "${path.module}/../lambdas/update_player/update_player.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/update_player/update_player.zip")

  environment {
    variables = {
      PLAYERS_TABLE = aws_dynamodb_table.players.name
    }
  }

  tags = merge(
    local.default_tags,
    { Name = "asc-ftv-${terraform.workspace}-update-player" }
  )
}

resource "aws_lambda_permission" "update_player_apigw" {
  statement_id  = "AllowAPIGatewayInvokeUpdatePlayer"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.update_player.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/${terraform.workspace}/*"
}
