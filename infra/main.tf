module "lambdas" {
  source   = "./modules/lambda"
  for_each = local.lambda_configs

  function_name = each.value.function_name
  role_arn      = aws_iam_role.lambda_role.arn

  filename         = data.archive_file.lambdas[each.key].output_path
  source_code_hash = data.archive_file.lambdas[each.key].output_base64sha256

  environment_variables = each.value.env
  tags                  = local.default_tags
}


module "games_table" {
  source = "./modules/dynamodb-table"

  name      = "asc-ftv-${terraform.workspace}-games"
  hash_key  = "pk"
  range_key = "sk"

  attributes = [
    { name = "pk", type = "S" },
    { name = "sk", type = "S" },
    { name = "id", type = "S" }
  ]

  global_secondary_indexes = [
    {
      name            = "id-index"
      hash_key        = "id"
      projection_type = "ALL"
    }
  ]

  tags = merge(
    local.default_tags,
    {
      Name = "asc-ftv-${terraform.workspace}-games"
    }
  )
}

module "players_table" {
  source = "./modules/dynamodb-table"

  name     = "asc-ftv-${terraform.workspace}-players"
  hash_key = "id"

  attributes = [
    { name = "id", type = "S" }
  ]

  tags = merge(
    local.default_tags,
    {
      Name = "asc-ftv-${terraform.workspace}-players"
    }
  )
}

module "apigateway" {
  source     = "./modules/apigateway"
  aws_region = var.aws_region

  default_tags        = local.default_tags
  cloudwatch_role_arn = aws_iam_role.apigw_cloudwatch_role.arn

  lambdas = local.lambda_arns

  depends_on = [
    aws_lambda_permission.apigw
  ]

}
