resource "aws_cloudwatch_log_group" "this" {
  name = "/aws/apigateway/${aws_api_gateway_rest_api.this.name}/${terraform.workspace}"

  retention_in_days = 14

  tags = merge(var.default_tags, {
    Name = "${terraform.workspace}-apigw-logs"
  })
}

resource "aws_api_gateway_stage" "this" {
  stage_name    = terraform.workspace
  rest_api_id   = aws_api_gateway_rest_api.this.id
  deployment_id = aws_api_gateway_deployment.this.id

  xray_tracing_enabled = true

  tags = merge(var.default_tags, {
    Name = "${terraform.workspace}-apigw-stage"
  })

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.this.arn
    format = jsonencode({
      requestId    = "$context.requestId"
      httpMethod   = "$context.httpMethod"
      resourcePath = "$context.resourcePath"
      status       = "$context.status"
    })
  }

  depends_on = [
    aws_api_gateway_account.this,
    aws_cloudwatch_log_group.this
  ]
}

