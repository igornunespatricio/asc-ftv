data "archive_file" "lambdas" {
  for_each = local.lambda_configs

  type        = "zip"
  source_dir  = each.value.source_dir
  output_path = "${path.module}/modules/lambda/zips/${each.key}.zip"
}
