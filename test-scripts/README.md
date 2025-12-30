# Test Scripts

This directory contains test scripts for validating application functionality.

## Running Tests

### game_inputer Permissions Test

Tests that users with "game_inputer" role can create games but cannot create users.

```bash
# Set the JWT secret environment variable
export JWT_SECRET="your-jwt-secret-here"

# Run the test
node test_game_inputer_permissions.js
```

Or run in one command:

```bash
JWT_SECRET="your-jwt-secret-here" node test_game_inputer_permissions.js
```

### Getting the JWT Secret

The JWT secret can be found in:

- AWS Lambda environment variables (for deployed lambdas)
- Local development configuration
- Ask your team lead for the development secret

## Test Coverage

- JWT token validation
- Role-based authorization
- Lambda function permissions
- Backward compatibility
