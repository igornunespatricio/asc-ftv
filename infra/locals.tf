locals {
  default_tags = merge(
    var.base_tags,
    { Env = terraform.workspace }
  )

  lambda_arns = {
    for name, mod in module.lambdas :
    name => mod.lambda_arn
  }

  api_cache_behaviors = {
    api = "/api/*"
  }

  lambda_configs = {
    login_user = {
      function_name = "asc-ftv-${terraform.workspace}-login-user"
      source_dir    = "${path.root}/../lambdas/login_user"
      env = {
        USERS_TABLE = module.users_table.table_name
        JWT_SECRET  = var.jwt_secret
      }
    }

    add_game = {
      function_name = "asc-ftv-${terraform.workspace}-add-game"
      source_dir    = "${path.root}/../lambdas/add_game"
      env           = { GAMES_TABLE = module.games_table.table_name }
    }

    get_games = {
      function_name = "asc-ftv-${terraform.workspace}-get-games"
      source_dir    = "${path.root}/../lambdas/get_games"
      env           = { GAMES_TABLE = module.games_table.table_name }
    }

    create_user = {
      function_name = "asc-ftv-${terraform.workspace}-create-user"
      source_dir    = "${path.root}/../lambdas/create_user"
      env           = { USERS_TABLE = module.users_table.table_name }
    }

    delete_user = {
      function_name = "asc-ftv-${terraform.workspace}-delete-user"
      source_dir    = "${path.root}/../lambdas/delete_user"
      env           = { USERS_TABLE = module.users_table.table_name }
    }

    update_user = {
      function_name = "asc-ftv-${terraform.workspace}-update-user"
      source_dir    = "${path.root}/../lambdas/update_user"
      env           = { USERS_TABLE = module.users_table.table_name }
    }

    list_users = {
      function_name = "asc-ftv-${terraform.workspace}-list-users"
      source_dir    = "${path.root}/../lambdas/list_users"
      env           = { USERS_TABLE = module.users_table.table_name }
    }

    get_ranking_month = {
      function_name = "asc-ftv-${terraform.workspace}-get-ranking-month"
      source_dir    = "${path.root}/../lambdas/get_ranking_month"
      env           = { GAMES_TABLE = module.games_table.table_name }
    }

    jwt_authorizer = {
      function_name = "asc-ftv-${terraform.workspace}-jwt-authorizer"
      source_dir    = "${path.root}/../lambdas/jwt_authorizer"
      env           = { JWT_SECRET = var.jwt_secret }
    }
  }
}
