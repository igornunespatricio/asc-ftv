#!/usr/bin/env bash

set -e

AWS_REGION="us-east-1"
S3_BUCKET="asc-ftv-terraform-state"
DDB_TABLE="asc-ftv-terraform-locks"

echo "=== Criando bucket S3 para armazenar o estado do Terraform ==="
aws s3api create-bucket \
  --bucket "$S3_BUCKET" \
  --region "$AWS_REGION" || true

echo "=== Criando tabela DynamoDB para lock ==="
aws dynamodb create-table \
  --table-name "$DDB_TABLE" \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST || true

echo "=== Backend do Terraform configurado com sucesso! ==="
echo "Bucket: $S3_BUCKET"
echo "DynamoDB: $DDB_TABLE"
