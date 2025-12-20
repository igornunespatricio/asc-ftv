# ASC Futevôlei – Infrastructure

Infrastructure as a code using Terraform and AWS services.

<!-- BEGIN_TERRAFORM_DOCS -->
<!-- END_TERRAFORM_DOCS -->

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.5 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 5.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_archive"></a> [archive](#provider\_archive) | 2.7.1 |
| <a name="provider_aws"></a> [aws](#provider\_aws) | 5.100.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_apigateway"></a> [apigateway](#module\_apigateway) | ./modules/apigateway | n/a |
| <a name="module_games_table"></a> [games\_table](#module\_games\_table) | ./modules/dynamodb-table | n/a |
| <a name="module_lambdas"></a> [lambdas](#module\_lambdas) | ./modules/lambda | n/a |
| <a name="module_players_table"></a> [players\_table](#module\_players\_table) | ./modules/dynamodb-table | n/a |

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy.lambda_dynamodb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.apigw_cloudwatch_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.lambda_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.apigw_cloudwatch_role_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.lambda_cloudwatch_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.lambda_dynamodb_attach](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_lambda_permission.apigw](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_s3_bucket.website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_cors_configuration.website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_cors_configuration) | resource |
| [aws_s3_bucket_ownership_controls.website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_ownership_controls) | resource |
| [aws_s3_bucket_policy.website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_policy) | resource |
| [aws_s3_bucket_public_access_block.website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block) | resource |
| [aws_s3_bucket_website_configuration.website](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_website_configuration) | resource |
| [aws_s3_object.config_js](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_object) | resource |
| [aws_s3_object.frontend](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_object) | resource |
| [archive_file.lambdas](https://registry.terraform.io/providers/hashicorp/archive/latest/docs/data-sources/file) | data source |
| [aws_iam_policy_document.website_public](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region to deploy all resources | `string` | `"us-east-1"` | no |
| <a name="input_base_tags"></a> [base\_tags](#input\_base\_tags) | Base tags applied to all resources | `map(string)` | <pre>{<br/>  "ManagedBy": "terraform",<br/>  "Owner": "asc-ftv",<br/>  "Project": "futevolei"<br/>}</pre> | no |
| <a name="input_dynamodb_table_name"></a> [dynamodb\_table\_name](#input\_dynamodb\_table\_name) | Base name for DynamoDB table (workspace prefix will be added automatically) | `string` | `"futevolei-games"` | no |
| <a name="input_jwt_secret"></a> [jwt\_secret](#input\_jwt\_secret) | JWT secret used by authorizer lambda | `string` | n/a | yes |
| <a name="input_lambda_role_arn"></a> [lambda\_role\_arn](#input\_lambda\_role\_arn) | IAM Role ARN used by all Lambda functions | `string` | n/a | yes |
| <a name="input_website_bucket"></a> [website\_bucket](#input\_website\_bucket) | Base name for website hosting bucket (workspace prefix will be added automatically) | `string` | `"futevolei-website"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_api_base_url"></a> [api\_base\_url](#output\_api\_base\_url) | n/a |
| <a name="output_api_http_url"></a> [api\_http\_url](#output\_api\_http\_url) | n/a |
| <a name="output_invoke_url"></a> [invoke\_url](#output\_invoke\_url) | n/a |
| <a name="output_lambda_invoke_arns"></a> [lambda\_invoke\_arns](#output\_lambda\_invoke\_arns) | n/a |
| <a name="output_workspace"></a> [workspace](#output\_workspace) | Current Terraform workspace |
<!-- END_TF_DOCS -->