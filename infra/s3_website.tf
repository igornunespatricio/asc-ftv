resource "aws_s3_bucket" "website" {
  bucket = var.website_bucket

  tags = {
    Name = "Website Bucket"
  }
}

# Obrigatório para permitir ACLs específicas (mas sem ACL pública no bucket)
resource "aws_s3_bucket_ownership_controls" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    object_ownership = "ObjectWriter"
  }
}

# Libera objetos para serem públicos (sem forçar o bucket todo a ser público)
resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Agora sim, liberamos acesso ao conteúdo através da policy
resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id
  policy = data.aws_iam_policy_document.website_public.json
}


# Configuração do website
resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# CORS (opcional, mas útil para requisições JS)
resource "aws_s3_bucket_cors_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

locals {
  frontend_files = fileset("${path.module}/../frontend", "**")
}

resource "aws_s3_object" "frontend" {
  for_each = { for f in local.frontend_files : f => f }

  bucket = aws_s3_bucket.website.id
  key    = each.value
  source = "${path.module}/../frontend/${each.value}"
  etag   = filemd5("${path.module}/../frontend/${each.value}")

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

resource "local_file" "config_js" {
  content = templatefile(
    "${path.module}/../frontend/config.js.tpl",
    {
      api_url = "${aws_api_gateway_stage.prod.invoke_url}/games"
    }
  )

  filename = "${path.module}/../frontend/config.js"
}

resource "aws_s3_object" "config_js" {
  bucket       = aws_s3_bucket.website.id
  key          = "config.js"
  source       = "${path.module}/../frontend/config.js"
  etag         = filemd5("${path.module}/../frontend/config.js")
  content_type = "application/javascript"
}
