const { DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const {
  successResponse,
  errorResponse,
  serverErrorResponse,
  notFoundResponse,
} = require("../shared/httpUtils");
const { requireAdmin } = require("../shared/authUtils");
const { getDocumentClient, TABLES } = require("../shared/dbConfig");
const { validatePathParameter } = require("../shared/validationUtils");

const dynamo = getDocumentClient();
const TABLE_NAME = TABLES.USERS;

exports.handler = async (event) => {
  try {
    // Check authorization
    const auth = requireAdmin(event);
    if (!auth.ok) return auth.response;

    console.log("pathParameters:", event.pathParameters);

    // Validate path parameter
    const pathValidation = validatePathParameter(event.pathParameters, "email");
    if (!pathValidation.ok) return pathValidation.response;
    const email = pathValidation.value;

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
