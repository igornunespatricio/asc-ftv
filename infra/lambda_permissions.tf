resource "aws_lambda_permission" "apigw" {
  for_each = module.lambdas

  statement_id  = "AllowAPIGatewayInvoke-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = each.value.lambda_arn
  principal     = "apigateway.amazonaws.com"

  source_arn = "${module.apigateway.execution_arn}/*/*"
}
