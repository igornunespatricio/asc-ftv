# ASC Futevôlei – Infrastructure

Infrastructure as code using Terraform and AWS services for deploying Lambda functions, API Gateway, S3, DynamoDB, and CloudFront.

## Organization

- Root files: main.tf (resources), variables.tf (inputs), outputs.tf (outputs), locals.tf (local values), providers.tf (providers config)
- IAM files: iam\_\*.tf for roles and policies
- CloudFront files: cloudfront\_\*.tf for CDN setup
- S3 files: s3\_\*.tf for website hosting
- Lambda files: lambda\_\*.tf for permissions and zips
- Modules: reusable components in modules/ (apigateway, dynamodb-table, lambda, lambda-layer)

## How it Works

- Uses Terraform workspaces (dev/prod) for environment separation
- Deploys serverless backend with Lambda functions behind API Gateway
- Stores data in DynamoDB tables
- Hosts static frontend in S3 with CloudFront CDN
- Manages IAM roles and policies for secure access

## TODOs

- Add CloudWatch monitoring and alerts for Lambda functions
- Implement cost optimization with reserved instances or spot instances where applicable
- Enhance security with WAF rules and additional encryption
