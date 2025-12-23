resource "aws_lambda_permission" "apigw" {
  for_each = module.lambdas

  statement_id  = "AllowAPIGatewayInvoke-${each.key}-${terraform.workspace}"
  action        = "lambda:InvokeFunction"
  function_name = each.value.lambda_arn
  principal     = "apigateway.amazonaws.com"

  # Permite qualquer stage/método da API no mesmo account/region
  source_arn = "arn:aws:execute-api:${var.aws_region}:${data.aws_caller_identity.current.account_id}:*/*/*"
}
