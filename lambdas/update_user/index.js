const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const {
  successResponse,
  errorResponse,
  accessDeniedResponse,
  badRequestResponse,
  serverErrorResponse,
  notFoundResponse,
} = require("../shared/httpUtils");
const { requireAdmin, validateRole } = require("../shared/authUtils");

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.USERS_TABLE;

// Valid roles for user assignment
const VALID_ROLES = ["admin", "game_inputer"];

exports.handler = async (event) => {
  console.log("pathParameters:", event.pathParameters);
  console.log("rawPath:", event.rawPath);

  try {
    const auth = requireAdmin(event);
    if (!auth.ok) return auth.response;

    const rawEmail = event.pathParameters?.email;

    if (!rawEmail) {
      return badRequestResponse("Missing email in path.");
    }

    const email = decodeURIComponent(rawEmail);
    const body = JSON.parse(event.body || "{}");

    if (!email) {
      return badRequestResponse("Missing email.");
    }

    if (
      body.username === undefined &&
      body.role === undefined &&
      body.active === undefined
    ) {
      return badRequestResponse("Nothing to update.");
    }

    const updates = [];
    const values = {};
    const names = {};

    if (body.username !== undefined) {
      updates.push("username = :username");
      values[":username"] = body.username;
    }

    if (body.role !== undefined) {
      // Validate role before updating
      try {
        validateRole(body.role);
      } catch (err) {
        return badRequestResponse(err.message);
      }
      updates.push("#role = :role");
      values[":role"] = body.role;
      names["#role"] = "role";
    }

    if (body.active !== undefined) {
      updates.push("active = :active");
      values[":active"] = body.active;
    }

    updates.push("updatedAt = :updatedAt");
    values[":updatedAt"] = Date.now();

    const result = await client.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { email },
        UpdateExpression: `SET ${updates.join(", ")}`,
        ExpressionAttributeValues: values,
        ExpressionAttributeNames: Object.keys(names).length ? names : undefined,
        ConditionExpression: "attribute_exists(email)",
        ReturnValues: "ALL_NEW",
      }),
    );

    return successResponse(200, {
      message: "User updated successfully.",
      user: result.Attributes,
    });
  } catch (err) {
    console.error("Error updating user:", err);

    if (err.name === "ConditionalCheckFailedException") {
      return notFoundResponse("User not found.");
    }

    return serverErrorResponse("Internal server error.");
  }
};
