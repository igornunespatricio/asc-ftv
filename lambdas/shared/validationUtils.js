/**
 * Shared input validation utilities for ASC-FTV lambda functions.
 * Provides centralized validation logic to eliminate code duplication.
 */

/**
 * Validates that required fields are present in an object.
 * @param {object} obj - Object to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {object} - { ok: boolean, missingFields?: string[] }
 */
function validateRequiredFields(obj, requiredFields) {
  const missingFields = requiredFields.filter((field) => !obj[field]);
  return {
    ok: missingFields.length === 0,
    missingFields: missingFields.length > 0 ? missingFields : undefined,
  };
}

/**
 * Safely parses JSON from event body with proper error handling.
 * @param {string} eventBody - Raw event body string
 * @returns {object} - { ok: boolean, body?: object, response?: errorResponse }
 */
function parseJsonBody(eventBody) {
  try {
    const body = JSON.parse(eventBody || "{}");
    return { ok: true, body };
  } catch (err) {
    return {
      ok: false,
      response: require("./httpUtils").badRequestResponse(
        "Invalid JSON payload",
      ),
    };
  }
}

/**
 * Validates path parameters from API Gateway event.
 * @param {object} pathParameters - Event pathParameters object
 * @param {string} paramName - Name of the parameter to validate
 * @returns {object} - { ok: boolean, value?: string, response?: errorResponse }
 */
function validatePathParameter(pathParameters, paramName) {
  const rawValue = pathParameters?.[paramName];
  if (!rawValue) {
    return {
      ok: false,
      response: require("./httpUtils").badRequestResponse(
        `Missing ${paramName} in path.`,
      ),
    };
  }

  try {
    const decodedValue = decodeURIComponent(rawValue);
    if (!decodedValue) {
      return {
        ok: false,
        response: require("./httpUtils").badRequestResponse(
          `Missing ${paramName}.`,
        ),
      };
    }
    return { ok: true, value: decodedValue };
  } catch (err) {
    return {
      ok: false,
      response: require("./httpUtils").badRequestResponse(
        `Invalid ${paramName} format.`,
      ),
    };
  }
}

/**
 * Comprehensive request validation combining JSON parsing and field validation.
 * @param {object} event - API Gateway event
 * @param {object} options - Validation options
 * @param {string[]} options.requiredBodyFields - Required fields in request body
 * @param {string[]} options.requiredPathParams - Required path parameters
 * @returns {object} - { ok: boolean, body?: object, pathParams?: object, response?: errorResponse }
 */
function validateRequest(event, options = {}) {
  const { requiredBodyFields = [], requiredPathParams = [] } = options;

  // Parse JSON body
  const jsonResult = parseJsonBody(event.body);
  if (!jsonResult.ok) return jsonResult;

  const body = jsonResult.body;

  // Validate required body fields
  if (requiredBodyFields.length > 0) {
    const fieldValidation = validateRequiredFields(body, requiredBodyFields);
    if (!fieldValidation.ok) {
      return {
        ok: false,
        response: require("./httpUtils").badRequestResponse(
          `Missing required fields: ${fieldValidation.missingFields.join(", ")}`,
        ),
      };
    }
  }

  // Validate required path parameters
  const pathParams = {};
  for (const paramName of requiredPathParams) {
    const paramValidation = validatePathParameter(
      event.pathParameters,
      paramName,
    );
    if (!paramValidation.ok) return paramValidation;
    pathParams[paramName] = paramValidation.value;
  }

  return { ok: true, body, pathParams };
}

/**
 * Validates game data according to business rules.
 * @param {object} body - Parsed request body
 * @returns {object} - { ok: boolean, response?: errorResponse }
 */
function validateGameData(body) {
  const { match_date, winner1, winner2, loser1, loser2 } = body;

  // Basic required fields validation (already done by validateRequest)
  const requiredValidation = validateRequiredFields(body, [
    "match_date",
    "winner1",
    "winner2",
    "loser1",
    "loser2",
  ]);
  if (!requiredValidation.ok) {
    return {
      ok: false,
      response: require("./httpUtils").badRequestResponse(
        `Missing required game fields: ${requiredValidation.missingFields.join(", ")}`,
      ),
    };
  }

  // Validate date format (basic YYYY-MM-DD check)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(match_date)) {
    return {
      ok: false,
      response: require("./httpUtils").badRequestResponse(
        "Invalid match_date format. Expected YYYY-MM-DD.",
      ),
    };
  }

  // Validate that winners and losers are different players
  const allPlayers = [winner1, winner2, loser1, loser2];
  const uniquePlayers = new Set(allPlayers);

  if (uniquePlayers.size < 4) {
    return {
      ok: false,
      response: require("./httpUtils").badRequestResponse(
        "All players must be unique.",
      ),
    };
  }

  // Validate that winners are different from each other and losers are different
  if (winner1 === winner2 || loser1 === loser2) {
    return {
      ok: false,
      response: require("./httpUtils").badRequestResponse(
        "Winner1 must differ from winner2, and loser1 must differ from loser2.",
      ),
    };
  }

  return { ok: true };
}

/**
 * Validates user data according to business rules.
 * @param {object} body - Parsed request body
 * @param {boolean} isCreate - Whether this is for user creation (vs update)
 * @returns {object} - { ok: boolean, response?: errorResponse }
 */
function validateUserData(body, isCreate = true) {
  const requiredFields = isCreate ? ["username", "email", "password"] : [];
  const requiredValidation = validateRequiredFields(body, requiredFields);

  if (!requiredValidation.ok) {
    const fieldNames = requiredValidation.missingFields
      .map((field) =>
        field === "username"
          ? "'username'"
          : field === "email"
            ? "'email'"
            : field === "password"
              ? "'password'"
              : field,
      )
      .join(", ");
    return {
      ok: false,
      response: require("./httpUtils").badRequestResponse(
        `Fields ${fieldNames} are required.`,
      ),
    };
  }

  // Basic email format validation
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return {
      ok: false,
      response: require("./httpUtils").badRequestResponse(
        "Invalid email format.",
      ),
    };
  }

  // Username length validation
  if (
    body.username &&
    (body.username.length < 2 || body.username.length > 50)
  ) {
    return {
      ok: false,
      response: require("./httpUtils").badRequestResponse(
        "Username must be between 2 and 50 characters.",
      ),
    };
  }

  // Password strength validation (for creation)
  if (isCreate && body.password && body.password.length < 6) {
    return {
      ok: false,
      response: require("./httpUtils").badRequestResponse(
        "Password must be at least 6 characters long.",
      ),
    };
  }

  return { ok: true };
}

/**
 * Validates update operations to ensure at least one field is being updated.
 * @param {object} body - Parsed request body
 * @param {string[]} updateableFields - Fields that can be updated
 * @returns {object} - { ok: boolean, response?: errorResponse }
 */
function validateUpdateOperation(body, updateableFields) {
  const hasUpdates = updateableFields.some(
    (field) => body[field] !== undefined,
  );

  if (!hasUpdates) {
    return {
      ok: false,
      response: require("./httpUtils").badRequestResponse("Nothing to update."),
    };
  }

  return { ok: true };
}

module.exports = {
  validateRequiredFields,
  parseJsonBody,
  validatePathParameter,
  validateRequest,
  validateGameData,
  validateUserData,
  validateUpdateOperation,
};
