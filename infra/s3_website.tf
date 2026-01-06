resource "aws_s3_bucket" "website" {
  bucket = "${terraform.workspace}-${var.website_bucket}"

  tags = merge(
    local.default_tags,
    {
      Name = "${terraform.workspace}-website-bucket"
    }
  )
}

resource "aws_s3_bucket_ownership_controls" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Upload de todos os arquivos do frontend (TypeScript em typescript/, HTML em pages/)
locals {
  typescript_files = fileset("${path.module}/../frontend/dist/typescript", "**")
  pages_files      = fileset("${path.module}/../frontend/dist/pages", "**")
  static_files     = fileset("${path.module}/../frontend/dist", "**")

  # Combine all files, excluding directories that are handled separately
  all_frontend_files = setunion(
    [for f in local.typescript_files : "typescript/${f}"],
    [for f in local.pages_files : "pages/${f}"],
    [for f in local.static_files : f if !contains(["typescript", "pages"], dirname(f)) && f != ""]
  )
}

resource "aws_s3_object" "frontend" {
  for_each = { for f in local.all_frontend_files : f => f }

  bucket = aws_s3_bucket.website.id
  key    = each.value
  source = "${path.module}/../frontend/dist/${each.value}"
  etag   = filemd5("${path.module}/../frontend/dist/${each.value}")

  content_type = lookup(
    {
      html = "text/html"
      js   = "application/javascript"
      css  = "text/css"
      png  = "image/png"
      jpg  = "image/jpeg"
      svg  = "image/svg+xml"
    },
    split(".", each.value)[length(split(".", each.value)) - 1],
    "text/plain"
  )

  tags = local.default_tags

  depends_on = [
    aws_s3_bucket_public_access_block.website
  ]
}

resource "aws_s3_object" "config_js" {
  bucket = aws_s3_bucket.website.id
  key    = "config.js"

  content = templatefile("${path.module}/../frontend/static/config.js.tpl", {
    api_url = module.apigateway.invoke_url
  })

  content_type = "application/javascript"
  tags         = local.default_tags

  depends_on = [
    aws_s3_bucket_public_access_block.website
  ]
}
