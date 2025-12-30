// Test script for authUtils.js shared utilities
// Tests authentication and role checking functionality

const {
  VALID_ROLES,
  requireAdmin,
  requireGameInputer,
  requireAdminOrGameInputer,
  getRoleFromEvent,
  isValidRole,
  validateRole,
} = require("../lambdas/shared/authUtils");

/**
 * Test VALID_ROLES constant
 */
function testValidRoles() {
  console.log("🧪 Test: VALID_ROLES constant");

  if (!Array.isArray(VALID_ROLES)) {
    console.log("❌ FAIL: VALID_ROLES is not an array");
    return false;
  }

  if (VALID_ROLES.length !== 2) {
    console.log("❌ FAIL: VALID_ROLES should have exactly 2 roles");
    return false;
  }

  if (!VALID_ROLES.includes("admin")) {
    console.log("❌ FAIL: VALID_ROLES should include 'admin'");
    return false;
  }

  if (!VALID_ROLES.includes("game_inputer")) {
    console.log("❌ FAIL: VALID_ROLES should include 'game_inputer'");
    return false;
  }

  // Test immutability (should be frozen)
  try {
    VALID_ROLES.push("test");
    console.log("❌ FAIL: VALID_ROLES should be immutable");
    return false;
  } catch (e) {
    console.log("✅ PASS: VALID_ROLES is immutable (frozen)");
  }

  console.log("✅ PASS: VALID_ROLES constant is correct");
  return true;
}

/**
 * Test getRoleFromEvent function
 */
function testGetRoleFromEvent() {
  console.log("🧪 Test: getRoleFromEvent function");

  // Test valid event
  const mockEvent = {
    requestContext: {
      authorizer: { role: "admin" },
    },
  };

  const role = getRoleFromEvent(mockEvent);
  if (role !== "admin") {
    console.log("❌ FAIL: getRoleFromEvent should return 'admin'");
    return false;
  }

  // Test missing authorizer
  const invalidEvent1 = {
    requestContext: {},
  };

  const role1 = getRoleFromEvent(invalidEvent1);
  if (role1 !== undefined) {
    console.log(
      "❌ FAIL: getRoleFromEvent should return undefined for missing authorizer",
    );
    return false;
  }

  // Test missing requestContext
  const invalidEvent2 = {};

  const role2 = getRoleFromEvent(invalidEvent2);
  if (role2 !== undefined) {
    console.log(
      "❌ FAIL: getRoleFromEvent should return undefined for missing requestContext",
    );
    return false;
  }

  console.log("✅ PASS: getRoleFromEvent function works correctly");
  return true;
}

/**
 * Test isValidRole function
 */
function testIsValidRole() {
  console.log("🧪 Test: isValidRole function");

  if (!isValidRole("admin")) {
    console.log("❌ FAIL: isValidRole should return true for 'admin'");
    return false;
  }

  if (!isValidRole("game_inputer")) {
    console.log("❌ FAIL: isValidRole should return true for 'game_inputer'");
    return false;
  }

  if (isValidRole("invalid")) {
    console.log("❌ FAIL: isValidRole should return false for 'invalid'");
    return false;
  }

  if (isValidRole("")) {
    console.log("❌ FAIL: isValidRole should return false for empty string");
    return false;
  }

  if (isValidRole(null)) {
    console.log("❌ FAIL: isValidRole should return false for null");
    return false;
  }

  if (isValidRole(undefined)) {
    console.log("❌ FAIL: isValidRole should return false for undefined");
    return false;
  }

  console.log("✅ PASS: isValidRole function works correctly");
  return true;
}

/**
 * Test validateRole function
 */
function testValidateRole() {
  console.log("🧪 Test: validateRole function");

  // Should not throw for valid roles
  try {
    validateRole("admin");
    validateRole("game_inputer");
    console.log("✅ PASS: validateRole accepts valid roles");
  } catch (e) {
    console.log("❌ FAIL: validateRole should not throw for valid roles");
    return false;
  }

  // Should throw for invalid roles
  try {
    validateRole("invalid");
    console.log("❌ FAIL: validateRole should throw for invalid role");
    return false;
  } catch (e) {
    if (e.message.includes("Invalid role")) {
      console.log(
        "✅ PASS: validateRole throws correct error for invalid role",
      );
    } else {
      console.log("❌ FAIL: validateRole throws wrong error message");
      return false;
    }
  }

  return true;
}

/**
 * Test requireAdmin function
 */
function testRequireAdmin() {
  console.log("🧪 Test: requireAdmin function");

  const adminEvent = {
    requestContext: {
      authorizer: { role: "admin" },
    },
  };

  const adminAuth = requireAdmin(adminEvent);
  if (!adminAuth.ok) {
    console.log("❌ FAIL: requireAdmin should allow admin role");
    return false;
  }

  const gameInputerEvent = {
    requestContext: {
      authorizer: { role: "game_inputer" },
    },
  };

  const gameInputerAuth = requireAdmin(gameInputerEvent);
  if (gameInputerAuth.ok) {
    console.log("❌ FAIL: requireAdmin should deny game_inputer role");
    return false;
  }

  if (!gameInputerAuth.response) {
    console.log(
      "❌ FAIL: requireAdmin should return response when access denied",
    );
    return false;
  }

  if (gameInputerAuth.response.statusCode !== 403) {
    console.log(
      "❌ FAIL: requireAdmin should return 403 status when access denied",
    );
    return false;
  }

  console.log("✅ PASS: requireAdmin function works correctly");
  return true;
}

/**
 * Test requireGameInputer function
 */
function testRequireGameInputer() {
  console.log("🧪 Test: requireGameInputer function");

  const gameInputerEvent = {
    requestContext: {
      authorizer: { role: "game_inputer" },
    },
  };

  const gameInputerAuth = requireGameInputer(gameInputerEvent);
  if (!gameInputerAuth.ok) {
    console.log("❌ FAIL: requireGameInputer should allow game_inputer role");
    return false;
  }

  const adminEvent = {
    requestContext: {
      authorizer: { role: "admin" },
    },
  };

  const adminAuth = requireGameInputer(adminEvent);
  if (adminAuth.ok) {
    console.log("❌ FAIL: requireGameInputer should deny admin role");
    return false;
  }

  console.log("✅ PASS: requireGameInputer function works correctly");
  return true;
}

/**
 * Test requireAdminOrGameInputer function
 */
function testRequireAdminOrGameInputer() {
  console.log("🧪 Test: requireAdminOrGameInputer function");

  const adminEvent = {
    requestContext: {
      authorizer: { role: "admin" },
    },
  };

  const gameInputerEvent = {
    requestContext: {
      authorizer: { role: "game_inputer" },
    },
  };

  const invalidEvent = {
    requestContext: {
      authorizer: { role: "invalid" },
    },
  };

  const adminAuth = requireAdminOrGameInputer(adminEvent);
  if (!adminAuth.ok) {
    console.log("❌ FAIL: requireAdminOrGameInputer should allow admin role");
    return false;
  }

  const gameInputerAuth = requireAdminOrGameInputer(gameInputerEvent);
  if (!gameInputerAuth.ok) {
    console.log(
      "❌ FAIL: requireAdminOrGameInputer should allow game_inputer role",
    );
    return false;
  }

  const invalidAuth = requireAdminOrGameInputer(invalidEvent);
  if (invalidAuth.ok) {
    console.log("❌ FAIL: requireAdminOrGameInputer should deny invalid role");
    return false;
  }

  console.log("✅ PASS: requireAdminOrGameInputer function works correctly");
  return true;
}

/**
 * Run all tests
 */
async function runTests() {
  console.log("🚀 Testing authUtils.js shared utilities\n");

  const results = await Promise.all([
    testValidRoles(),
    testGetRoleFromEvent(),
    testIsValidRole(),
    testValidateRole(),
    testRequireAdmin(),
    testRequireGameInputer(),
    testRequireAdminOrGameInputer(),
  ]);

  const passed = results.filter(Boolean).length;
  const total = results.length;

  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log("🎉 All authUtils tests passed!");
  } else {
    console.log("❌ Some tests failed. Check the authUtils implementation.");
  }

  return passed === total;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testValidRoles,
  testGetRoleFromEvent,
  testIsValidRole,
  testValidateRole,
  testRequireAdmin,
  testRequireGameInputer,
  testRequireAdminOrGameInputer,
};
