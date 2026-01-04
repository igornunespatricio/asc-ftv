const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const {
  successResponse,
  errorResponse,
  serverErrorResponse,
  notFoundResponse,
  badRequestResponse,
  requireAdmin,
  validateRole,
  getDocumentClient,
  TABLES,
  validateRequest,
  validatePathParameter,
  validateUpdateOperation,
  validateUserData,
} = require("shared-utils");

const dynamo = getDocumentClient();
const TABLE_NAME = TABLES.USERS;

exports.handler = async (event) => {
  console.log("pathParameters:", event.pathParameters);
  console.log("rawPath:", event.rawPath);

  try {
    // Check authorization
    const auth = requireAdmin(event);
    if (!auth.ok) return auth.response;

    // Validate path parameter
    const pathValidation = validatePathParameter(event.pathParameters, "email");
    if (!pathValidation.ok) return pathValidation.response;
    const email = pathValidation.value;

    // Validate request body
    const validation = validateRequest(event, { requiredBodyFields: [] });
    if (!validation.ok) return validation.response;

    // Check if there's anything to update
    const updateValidation = validateUpdateOperation(validation.body, [
      "username",
      "role",
      "active",
    ]);
    if (!updateValidation.ok) return updateValidation.response;

    // Validate user data (for updates, not creation)
    const userValidation = validateUserData(validation.body, false);
    if (!userValidation.ok) return userValidation.response;

    const updates = [];
    const values = {};
    const names = {};

    if (validation.body.username !== undefined) {
      updates.push("username = :username");
      values[":username"] = validation.body.username;
    }

    if (validation.body.role !== undefined) {
      // Validate role before updating
      try {
        validateRole(validation.body.role);
      } catch (err) {
        return badRequestResponse(err.message);
      }
      updates.push("#role = :role");
      values[":role"] = validation.body.role;
      names["#role"] = "role";
    }

    if (validation.body.active !== undefined) {
      updates.push("active = :active");
      values[":active"] = validation.body.active;
    }

    updates.push("updatedAt = :updatedAt");
    values[":updatedAt"] = Date.now();

    const result = await dynamo.send(
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
