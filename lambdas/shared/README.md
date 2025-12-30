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
