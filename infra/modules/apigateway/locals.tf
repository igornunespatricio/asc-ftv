locals {
  lambda_invoke_uris = {
    for name, arn in var.lambdas :
    name => "arn:aws:apigateway:${data.aws_region.current.name}:lambda:path/2015-03-31/functions/${arn}/invocations"
  }
}
