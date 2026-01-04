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
      function_name    = "asc-ftv-${terraform.workspace}-login-user"
      source_dir       = "${path.root}/../lambdas/login_user"
      use_shared_layer = true
      env = {
        USERS_TABLE = module.users_table.table_name
        JWT_SECRET  = var.jwt_secret
        NODE_PATH   = "/opt/node_modules"
      }
    }

    add_game = {
      function_name    = "asc-ftv-${terraform.workspace}-add-game"
      source_dir       = "${path.root}/../lambdas/add_game"
      use_shared_layer = true
      env = {
        GAMES_TABLE = module.games_table.table_name
        NODE_PATH   = "/opt/node_modules"
      }
    }

    get_games = {
      function_name    = "asc-ftv-${terraform.workspace}-get-games"
      source_dir       = "${path.root}/../lambdas/get_games"
      use_shared_layer = true
      env = {
        GAMES_TABLE = module.games_table.table_name
        NODE_PATH   = "/opt/node_modules"
      }
    }

    create_user = {
      function_name    = "asc-ftv-${terraform.workspace}-create-user"
      source_dir       = "${path.root}/../lambdas/create_user"
      use_shared_layer = true
      env = {
        USERS_TABLE = module.users_table.table_name
        NODE_PATH   = "/opt/node_modules"
      }
    }

    delete_user = {
      function_name    = "asc-ftv-${terraform.workspace}-delete-user"
      source_dir       = "${path.root}/../lambdas/delete_user"
      use_shared_layer = true
      env = {
        USERS_TABLE = module.users_table.table_name
        NODE_PATH   = "/opt/node_modules"
      }
    }

    update_user = {
      function_name    = "asc-ftv-${terraform.workspace}-update-user"
      source_dir       = "${path.root}/../lambdas/update_user"
      use_shared_layer = true
      env = {
        USERS_TABLE = module.users_table.table_name
        NODE_PATH   = "/opt/node_modules"
      }
    }

    list_users = {
      function_name    = "asc-ftv-${terraform.workspace}-list-users"
      source_dir       = "${path.root}/../lambdas/list_users"
      use_shared_layer = true
      env = {
        USERS_TABLE = module.users_table.table_name
        NODE_PATH   = "/opt/node_modules"
      }
    }

    get_ranking_month = {
      function_name    = "asc-ftv-${terraform.workspace}-get-ranking-month"
      source_dir       = "${path.root}/../lambdas/get_ranking_month"
      use_shared_layer = true
      env = {
        GAMES_TABLE = module.games_table.table_name
        NODE_PATH   = "/opt/node_modules"
      }
    }

    jwt_authorizer = {
      function_name    = "asc-ftv-${terraform.workspace}-jwt-authorizer"
      source_dir       = "${path.root}/../lambdas/jwt_authorizer"
      use_shared_layer = false
      env              = { JWT_SECRET = var.jwt_secret }
    }
  }
}
