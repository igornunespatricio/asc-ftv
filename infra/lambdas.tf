# ---------------------------------------------------------
# ADD GAME
# ---------------------------------------------------------
resource "aws_lambda_function" "add_game" {
  function_name = "asc-ftv-${terraform.workspace}-add-game"

  role    = aws_iam_role.lambda_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"

  filename         = "${path.module}/../backend/add_game/add_game.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/add_game/add_game.zip")

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

  filename         = "${path.module}/../backend/get_games/get_games.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/get_games/get_games.zip")

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

  filename         = "${path.module}/../backend/get_ranking_month/get_ranking_month.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/get_ranking_month/get_ranking_month.zip")

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
