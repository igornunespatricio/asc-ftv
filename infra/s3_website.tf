resource "aws_s3_bucket" "website" {
  bucket = "${terraform.workspace}-${var.website_bucket}"

  tags = merge(
    local.default_tags,
    {
      Name = "${terraform.workspace}-website-bucket"
    }
  )
}

# Ownership (obrigatório)
resource "aws_s3_bucket_ownership_controls" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    object_ownership = "ObjectWriter"
  }
}

# Liberação de ACLs (necessário para website)
resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Política pública do bucket
resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id
  policy = data.aws_iam_policy_document.website_public.json
}

data "aws_iam_policy_document" "website_public" {
  statement {
    sid     = "AllowPublicRead"
    effect  = "Allow"
    actions = ["s3:GetObject"]

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    resources = [
      "${aws_s3_bucket.website.arn}/*"
    ]
  }
}

# Website Hosting
resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# CORS para frontend
resource "aws_s3_bucket_cors_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

# Upload de todos os arquivos do frontend
locals {
  frontend_files = fileset("${path.module}/../frontend", "**")
}

resource "aws_s3_object" "frontend" {
  for_each = { for f in local.frontend_files : f => f }

  bucket = aws_s3_bucket.website.id
  key    = each.value
  source = "${path.module}/../frontend/${each.value}"
  etag   = filemd5("${path.module}/../frontend/${each.value}")

  tags = local.default_tags

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
}

# Geração do config.js com URL dinâmica via workspace
resource "aws_s3_object" "config_js" {
  bucket = aws_s3_bucket.website.id
  key    = "config.js"
  content = templatefile("${path.module}/../frontend/config.js.tpl", {
    api_url = aws_api_gateway_stage.stage.invoke_url
  })
  content_type = "application/javascript"
  tags         = local.default_tags
}

