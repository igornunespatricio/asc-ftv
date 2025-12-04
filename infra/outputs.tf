output "api_http_url" {
  value       = "${aws_api_gateway_stage.prod.invoke_url}/games"
  description = "HTTP URL to invoke the Futevolei API POST /games"
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.games_v2.name
}
