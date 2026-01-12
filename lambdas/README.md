# ASC Futevôlei – Lambdas

Serverless functions written in Node.js for handling API requests, data processing, and business logic.

## Organization

- Each lambda in its own directory with index.js (handler), package.json (dependencies), and package-lock.json
- Functions: add_game, create_user, delete_user, get_games, get_ranking_month, jwt_authorizer, list_users, login_user, update_user
- Shared dependencies via lambda layer in infra/modules/lambda-layer

## How it Works

- Triggered by API Gateway events
- Authenticate requests using JWT authorizer lambda
- Interact with DynamoDB for data storage and retrieval
- Return JSON responses with appropriate HTTP status codes
- Handle CRUD operations for users and games

## TODOs

- Add comprehensive error handling and logging for all lambdas
- Implement input validation and sanitization
- Add unit tests for each lambda function
