// Standardized CORS headers for all lambda functions
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

// Success response helper
function successResponse(statusCode, body, headers = CORS_HEADERS) {
  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
}

// Error response helper
function errorResponse(statusCode, message, headers = CORS_HEADERS) {
  return {
    statusCode,
    headers,
    body: JSON.stringify({ message }),
  };
}

// Access denied response helper
function accessDeniedResponse(headers = CORS_HEADERS) {
  return errorResponse(403, "Access denied", headers);
}

// Bad request response helper
function badRequestResponse(message, headers = CORS_HEADERS) {
  return errorResponse(400, message, headers);
}

// Internal server error response helper
function serverErrorResponse(
  message = "Internal server error",
  headers = CORS_HEADERS,
) {
  return errorResponse(500, message, headers);
}

// Not found response helper
function notFoundResponse(message, headers = CORS_HEADERS) {
  return errorResponse(404, message, headers);
}

module.exports = {
  CORS_HEADERS,
  successResponse,
  errorResponse,
  accessDeniedResponse,
  badRequestResponse,
  serverErrorResponse,
  notFoundResponse,
};
