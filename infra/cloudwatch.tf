# CloudWatch log group
resource "aws_cloudwatch_log_group" "api_gw_logs" {
  name              = "/aws/apigateway/futevolei-api"
  retention_in_days = 14
}
