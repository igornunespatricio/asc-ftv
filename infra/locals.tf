locals {
  default_tags = merge(
    var.base_tags,
    { Env = terraform.workspace }
  )

  lambda_arns = {
    for name, mod in module.lambdas :
    name => mod.lambda_arn
  }

  lambda_configs = {
    add_game = {
      function_name = "asc-ftv-${terraform.workspace}-add-game"
      env = {
        GAMES_TABLE = module.games_table.table_name
      }
    }

    get_games = {
      function_name = "asc-ftv-${terraform.workspace}-get-games"
      env = {
        GAMES_TABLE = module.games_table.table_name
      }
    }

    create_player = {
      function_name = "asc-ftv-${terraform.workspace}-create-player"
      env = {
        PLAYERS_TABLE = module.players_table.table_name
      }
    }

    delete_player = {
      function_name = "asc-ftv-${terraform.workspace}-delete-player"
      env = {
        PLAYERS_TABLE = module.players_table.table_name
      }
    }

    update_player = {
      function_name = "asc-ftv-${terraform.workspace}-update-player"
      env = {
        PLAYERS_TABLE = module.players_table.table_name
      }
    }

    list_players = {
      function_name = "asc-ftv-${terraform.workspace}-list-players"
      env = {
        PLAYERS_TABLE = module.players_table.table_name
      }
    }

    get_ranking_month = {
      function_name = "asc-ftv-${terraform.workspace}-get-ranking-month"
      env = {
        GAMES_TABLE = module.games_table.table_name
      }
    }

    jwt_authorizer = {
      function_name = "asc-ftv-${terraform.workspace}-jwt-authorizer"
      env = {
        JWT_SECRET = var.jwt_secret
      }
    }
  }
}
