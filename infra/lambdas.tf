# Lambda Function
resource "aws_lambda_function" "add_game" {
  function_name    = "addFutevoleiGame"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  filename         = "${path.module}/../backend/add_game/add_game.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/add_game/add_game.zip")
  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.games.name
    }
  }
}


resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.add_game.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}


resource "aws_lambda_function" "get_games" {
  function_name    = "getFutevoleiGames"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  filename         = "${path.module}/../backend/get_games/get_games.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/get_games/get_games.zip")
  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.games.name
    }
  }
}


resource "aws_lambda_permission" "apigw_get" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_games.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

resource "aws_lambda_function" "get_ranking_month" {
  function_name = "getFutevoleiRankingMonth"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"

  filename         = "${path.module}/../backend/get_ranking_month/get_ranking_month.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/get_ranking_month/get_ranking_month.zip")

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.games.name
    }
  }
}

resource "aws_lambda_permission" "apigw_get_ranking" {
  statement_id  = "AllowAPIGatewayInvokeRanking"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_ranking_month.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}
