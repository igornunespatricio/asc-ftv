resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  # Garante recriação quando algo muda
  triggers = {
    redeploy = sha1(jsonencode([
      aws_api_gateway_resource.games.id,
      aws_api_gateway_resource.players.id,
      aws_api_gateway_resource.player_id.id,
      aws_api_gateway_resource.ranking.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    # ---------- /games ----------
    aws_api_gateway_integration.games_get,
    aws_api_gateway_integration.games_post,
    aws_api_gateway_integration.games_options,

    # ---------- /players ----------
    aws_api_gateway_integration.players_get,
    aws_api_gateway_integration.players_post,
    aws_api_gateway_integration.players_options,

    # ---------- /players/{id} ----------
    aws_api_gateway_integration.player_put,
    aws_api_gateway_integration.player_delete,
    aws_api_gateway_integration.player_id_options,

    # ---------- /ranking ----------
    aws_api_gateway_integration.ranking_get,
    aws_api_gateway_integration.ranking_options,
  ]
}
