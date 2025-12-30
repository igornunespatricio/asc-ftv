const { accessDeniedResponse } = require("./httpUtils");

// Valid roles in the system
const VALID_ROLES = Object.freeze(["admin", "game_inputer"]);

// Extract role from API Gateway event
function getRoleFromEvent(event) {
  return event.requestContext?.authorizer?.role;
}

// Role validation
function isValidRole(role) {
  return VALID_ROLES.includes(role);
}

function validateRole(role) {
  if (!isValidRole(role)) {
    throw new Error(
      `Invalid role '${role}'. Valid roles are: ${VALID_ROLES.join(", ")}`,
    );
  }
}

// Authentication requirement functions that return {ok: boolean, response?: object} pattern
function requireAdmin(event) {
  const role = getRoleFromEvent(event);
  if (role !== "admin") {
    return { ok: false, response: accessDeniedResponse() };
  }
  return { ok: true };
}

function requireGameInputer(event) {
  const role = getRoleFromEvent(event);
  if (role !== "game_inputer") {
    return { ok: false, response: accessDeniedResponse() };
  }
  return { ok: true };
}

function requireAdminOrGameInputer(event) {
  const role = getRoleFromEvent(event);
  if (role !== "admin" && role !== "game_inputer") {
    return { ok: false, response: accessDeniedResponse() };
  }
  return { ok: true };
}

module.exports = {
  VALID_ROLES,
  getRoleFromEvent,
  isValidRole,
  validateRole,
  requireAdmin,
  requireGameInputer,
  requireAdminOrGameInputer,
};
