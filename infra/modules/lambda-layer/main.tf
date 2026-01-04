resource "aws_lambda_layer_version" "shared_utils" {
  layer_name          = "asc-ftv-${var.environment}-shared-utils"
  description         = "Shared utilities for ASC-FTV lambda functions"
  compatible_runtimes = ["nodejs18.x"]

  filename         = data.archive_file.layer_zip.output_path
  source_code_hash = data.archive_file.layer_zip.output_sha256
}

data "archive_file" "layer_zip" {
  type        = "zip"
  source_dir  = "${path.module}/nodejs"
  output_path = "${path.module}/shared-utils-layer.zip"
}
