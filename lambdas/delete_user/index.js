const { DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const {
  successResponse,
  errorResponse,
  accessDeniedResponse,
  badRequestResponse,
  serverErrorResponse,
  notFoundResponse,
} = require("../shared/httpUtils");
const { requireAdmin } = require("../shared/authUtils");
const { getDocumentClient, TABLES } = require("../shared/dbConfig");

const dynamo = getDocumentClient();
const TABLE_NAME = TABLES.USERS;

exports.handler = async (event) => {
  try {
    const auth = requireAdmin(event);
    if (!auth.ok) return auth.response;

    console.log("pathParameters:", event.pathParameters);

    const rawEmail = event.pathParameters?.email;

    if (!rawEmail) {
      return badRequestResponse("Missing email.");
    }

    const email = decodeURIComponent(rawEmail);

    await dynamo.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { email },
        ConditionExpression: "attribute_exists(email)",
      }),
    );

    console.log(`User deleted successfully: ${email}`);

    return successResponse(204, "");
  } catch (err) {
    console.error("Error deleting user:", err);

    if (err.name === "ConditionalCheckFailedException") {
      return notFoundResponse("User not found.");
    }

    return serverErrorResponse("Internal server error.");
  }
};
