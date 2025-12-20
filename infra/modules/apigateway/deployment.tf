resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  triggers = {
    redeploy = sha1(jsonencode(
      aws_api_gateway_rest_api.this.id
    ))
  }

  lifecycle {
    create_before_destroy = true
  }
}
