const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { successResponse, serverErrorResponse } = require("../shared/httpUtils");
const { getDocumentClient, TABLES } = require("../shared/dbConfig");

const dynamo = getDocumentClient();
const TABLE_NAME = TABLES.USERS;

exports.handler = async () => {
  try {
    const result = await dynamo.send(
      new ScanCommand({ TableName: TABLE_NAME }),
    );

    const users = (result.Items || []).map((user) => ({
      email: user.email,
      username: user.username,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return successResponse(200, users);
  } catch (err) {
    console.error("Error listing players:", err);
    return serverErrorResponse("Internal server error.");
  }
};
