output "api_http_url" {
  description = "HTTP base URL for the API for the selected workspace"
  value       = "${aws_api_gateway_stage.stage.invoke_url}/games"
}

output "api_base_url" {
  description = "Base URL of the API Gateway stage"
  value       = aws_api_gateway_stage.stage.invoke_url
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table for this workspace"
  value       = aws_dynamodb_table.games.name
}

output "workspace" {
  description = "Current Terraform workspace"
  value       = terraform.workspace
}
