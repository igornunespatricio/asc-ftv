const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require("bcryptjs");
const {
  successResponse,
  errorResponse,
  accessDeniedResponse,
  badRequestResponse,
  serverErrorResponse,
} = require("../shared/httpUtils");
const { requireAdmin, validateRole } = require("../shared/authUtils");

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.USERS_TABLE;

// Valid roles for user assignment
const VALID_ROLES = ["admin", "game_inputer"];

exports.handler = async (event) => {
  try {
    const auth = requireAdmin(event);
    if (!auth.ok) return auth.response;

    const body = JSON.parse(event.body || "{}");

    if (!body.username || !body.email || !body.password) {
      return badRequestResponse(
        "Fields 'username', 'email' and 'password' are required.",
      );
    }

    // Validate role if provided
    const requestedRole = body.role ?? "game_inputer";
    try {
      validateRole(requestedRole);
    } catch (err) {
      return badRequestResponse(err.message);
    }

    const passwordHash = bcrypt.hashSync(body.password, 10);

    const now = Date.now();

    const item = {
      username: body.username,
      email: body.email,
      password_hash: passwordHash,
      role: requestedRole,
      active: body.active ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await client.send(
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
