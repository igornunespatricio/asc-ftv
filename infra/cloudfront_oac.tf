resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "asc-ftv-${terraform.workspace}-oac"
  description                       = "OAC for S3 website bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
