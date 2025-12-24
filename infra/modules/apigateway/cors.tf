# ---------------------------------------------------------
# Common CORS response parameters
# ---------------------------------------------------------

locals {
  cors_headers = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  cors_integration_headers = {
    "method.response.header.Access-Control-Allow-Headers" = "'content-type,authorization'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}
