output "layer_arn" {
  description = "ARN of the shared utils lambda layer"
  value       = aws_lambda_layer_version.shared_utils.arn
}

output "layer_version" {
  description = "Version of the shared utils lambda layer"
  value       = aws_lambda_layer_version.shared_utils.version
}
