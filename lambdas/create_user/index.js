const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require("bcryptjs");
const {
  successResponse,
  errorResponse,
  serverErrorResponse,
  requireAdmin,
  validateRole,
  getDocumentClient,
  TABLES,
  validateRequest,
  validateUserData,
  badRequestResponse,
} = require("shared-utils");

const dynamo = getDocumentClient();
const TABLE_NAME = TABLES.USERS;

exports.handler = async (event) => {
  try {
    // Check authorization
    const auth = requireAdmin(event);
    if (!auth.ok) return auth.response;

    // Validate request
    const validation = validateRequest(event, {
      requiredBodyFields: ["username", "email", "password"],
    });
    if (!validation.ok) return validation.response;

    // Validate user data
    const userValidation = validateUserData(validation.body, true);
    if (!userValidation.ok) return userValidation.response;

    const { username, email, password } = validation.body;

    // Validate role if provided
    const requestedRole = validation.body.role ?? "game_inputer";
    try {
      validateRole(requestedRole);
    } catch (err) {
      return badRequestResponse(err.message);
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const now = Date.now();

    const item = {
      username,
      email,
      password_hash: passwordHash,
      role: requestedRole,
      active: validation.body.active ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await dynamo.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
        ConditionExpression: "attribute_not_exists(email)",
      }),
    );

    return successResponse(201, {
      username: item.username,
      email: item.email,
      role: item.role,
      active: item.active,
      createdAt: item.createdAt,
    });
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      return errorResponse(409, "User already exists.");
    }

    console.error("Error creating user:", err);
    return serverErrorResponse("Internal server error.");
  }
};
