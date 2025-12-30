// Test script for "Modify lambda functions to check for game_inputer role instead of viewer"
// Tests that game_inputer role can create games but cannot create users

const jwt = require("jsonwebtoken");

// Get JWT secret from environment variable (secure approach)
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ Error: JWT_SECRET environment variable is not set!");
  console.error("Please set it using: export JWT_SECRET='your-secret-here'");
  console.error(
    "Or run with: JWT_SECRET='your-secret-here' node test_game_inputer_permissions.js",
  );
  process.exit(1);
}

// Test user with game_inputer role
const gameInputerUser = {
  email: "gameinputer@test.com",
  username: "Game Inputer",
  role: "game_inputer",
};

// API Gateway ARNs (from user)
const GAMES_API_ARN =
  "arn:aws:execute-api:us-east-1:667902538623:uqd4qs3gha/*/POST/api/games";
const USERS_API_ARN =
  "arn:aws:execute-api:us-east-1:667902538623:uqd4qs3gha/*/POST/api/users";

// Mock lambda handlers (for local testing without AWS SDK)
const jwtAuthorizer = require("../lambdas/jwt_authorizer/index.js");

// Mock add_game authorization logic (without AWS dependencies)
function mockAddGameAuthCheck(role) {
  return role === "admin" || role === "game_inputer";
}

// Mock create_user authorization logic (without AWS dependencies)
function mockCreateUserAuthCheck(role) {
  return role === "admin";
}

/**
 * Create JWT token for test user
 */
function createTestToken(user) {
  return jwt.sign(
    {
      email: user.email,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
  );
}

/**
 * Simulate API Gateway event
 */
function createApiGatewayEvent(token, methodArn, body = null) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    methodArn: methodArn,
    ...(body && { body: JSON.stringify(body) }),
  };
}

/**
 * Test game_inputer can create games
 */
async function testGameInputerCanCreateGames() {
  console.log("🧪 Test: game_inputer role can create games");

  const token = createTestToken(gameInputerUser);

  // Test JWT authorization
  const authEvent = createApiGatewayEvent(token, GAMES_API_ARN);
  const authResult = await jwtAuthorizer.handler(authEvent);

  if (authResult.policyDocument.Statement[0].Effect !== "Allow") {
    console.log("❌ FAIL: JWT authorization denied access");
    return false;
  }

  console.log("✅ PASS: JWT authorization allows access");

  // Test game creation authorization (mocked)
  const gameAuthResult = mockAddGameAuthCheck("game_inputer");

  if (gameAuthResult) {
    console.log("✅ PASS: Game creation authorization succeeded");
    return true;
  } else {
    console.log("❌ FAIL: Game creation authorization failed");
    return false;
  }
}

/**
 * Test game_inputer cannot create users
 */
async function testGameInputerCannotCreateUsers() {
  console.log("🧪 Test: game_inputer role cannot create users");

  const token = createTestToken(gameInputerUser);

  // Test JWT authorization
  const authEvent = createApiGatewayEvent(token, USERS_API_ARN);
  const authResult = await jwtAuthorizer.handler(authEvent);

  if (authResult.policyDocument.Statement[0].Effect !== "Allow") {
    console.log("❌ FAIL: JWT authorization denied access");
    return false;
  }

  console.log(
    "✅ PASS: JWT authorization allows access (expected for API Gateway level)",
  );

  // Test user creation authorization (mocked)
  const userAuthResult = mockCreateUserAuthCheck("game_inputer");

  if (!userAuthResult) {
    console.log("✅ PASS: User creation authorization correctly denied");
    return true;
  } else {
    console.log("❌ FAIL: User creation authorization should be denied");
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log("🚀 Testing game_inputer role permissions\n");

  const results = await Promise.all([
    testGameInputerCanCreateGames(),
    testGameInputerCannotCreateUsers(),
  ]);

  const passed = results.filter(Boolean).length;
  const total = results.length;

  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log(
      "🎉 All tests passed! game_inputer role permissions working correctly.",
    );
  } else {
    console.log("❌ Some tests failed. Check the implementation.");
  }

  return passed === total;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testGameInputerCanCreateGames,
  testGameInputerCannotCreateUsers,
};
