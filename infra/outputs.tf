output "invoke_url" {
  value = module.apigateway.invoke_url
}

output "api_base_url" {
  value = module.apigateway.invoke_url
}

output "api_http_url" {
  value = "${module.apigateway.invoke_url}/games"
}

output "workspace" {
  description = "Current Terraform workspace"
  value       = terraform.workspace
}
output "lambda_invoke_arns" {
  value = {
    for k, m in module.lambdas :
    k => m.invoke_arn
  }
}
