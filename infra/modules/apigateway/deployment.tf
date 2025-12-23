resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  # Garante recriação quando algo muda
  triggers = {
    # redeploy = sha1(jsonencode([
    #   aws_api_gateway_resource.games.id,
    #   aws_api_gateway_resource.users.id,
    #   aws_api_gateway_resource.user_id.id,
    #   aws_api_gateway_resource.ranking.id,
    #   aws_api_gateway_resource.login.id,
    # ]))
    redeploy = timestamp()
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    # ---------- /games ----------
    aws_api_gateway_integration.games_get,
    aws_api_gateway_integration.games_post,
    aws_api_gateway_integration.games_options,

    # ---------- /users ----------
    aws_api_gateway_integration.users_get,
    aws_api_gateway_integration.users_post,
    aws_api_gateway_integration.users_options,

    # ---------- /users/{id} ----------
    aws_api_gateway_integration.user_put,
    aws_api_gateway_integration.user_delete,
    aws_api_gateway_integration.user_id_options,

    # ---------- /ranking ----------
    aws_api_gateway_integration.ranking_get,
    aws_api_gateway_integration.ranking_options,

    # ---------- /login ----------
    aws_api_gateway_integration.login_post,
    aws_api_gateway_integration.login_options,
  ]
}
