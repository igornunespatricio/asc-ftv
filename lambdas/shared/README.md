# Shared Utilities

This module contains shared utilities for ASC-FTV lambda functions, promoting code reuse and consistency across the backend.

## httpUtils.js

Standardized HTTP utilities for CORS headers and common response formats.

### CORS_HEADERS

Standardized CORS headers object used across all lambda functions:

```javascript
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
}
```

### Response Functions

#### successResponse(statusCode, body, headers?)

Returns a successful HTTP response with CORS headers.

#### errorResponse(statusCode, message, headers?)

Returns an error HTTP response with CORS headers.

#### accessDeniedResponse(headers?)

Returns a 403 Access Denied response.

#### badRequestResponse(message, headers?)

Returns a 400 Bad Request response.

#### serverErrorResponse(message?, headers?)

Returns a 500 Internal Server Error response.

#### notFoundResponse(message, headers?)

Returns a 404 Not Found response.

### Usage Example

```javascript
const {
  CORS_HEADERS,
  successResponse,
  errorResponse,
  accessDeniedResponse,
} = require("../shared/httpUtils");

// Direct header usage
return {
  statusCode: 200,
  headers: CORS_HEADERS,
  body: JSON.stringify(data),
};

// Using response helpers
return successResponse(201, { id: newId });

// Error responses
if (!authorized) {
  return accessDeniedResponse();
}
```

## authUtils.js

Standardized authentication and role checking utilities.

### VALID_ROLES

Frozen array of valid roles in the system:

```javascript
["admin", "game_inputer"];
```

### Role Checking Functions

#### requireAdmin(event)

Returns `{ok: true}` if user has admin role, otherwise `{ok: false, response: accessDeniedResponse()}`

#### requireGameInputer(event)

Returns `{ok: true}` if user has game_inputer role, otherwise `{ok: false, response: accessDeniedResponse()}`

#### requireAdminOrGameInputer(event)

Returns `{ok: true}` if user has admin or game_inputer role, otherwise `{ok: false, response: accessDeniedResponse()}`

### Utility Functions

#### getRoleFromEvent(event)

Extracts role from API Gateway event: `event.requestContext?.authorizer?.role`

#### isValidRole(role)

Returns boolean indicating if the role is valid

#### validateRole(role)

Throws error if role is invalid, does nothing if valid

### Usage Example

```javascript
const {
  requireAdmin,
  requireAdminOrGameInputer,
  getRoleFromEvent,
  validateRole,
  VALID_ROLES,
} = require("../shared/authUtils");

// Check admin access
const auth = requireAdmin(event);
if (!auth.ok) return auth.response;

// Check admin or game_inputer access
const gameAuth = requireAdminOrGameInputer(event);
if (!gameAuth.ok) return gameAuth.response;

// Get current user role
const userRole = getRoleFromEvent(event);

// Validate role before using
validateRole(requestedRole); // Throws if invalid

// Check if role is valid
if (!VALID_ROLES.includes(someRole)) {
  // Handle invalid role
}
```
