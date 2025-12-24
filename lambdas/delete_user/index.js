const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.USERS_TABLE;

// Cabeçalhos CORS
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

exports.handler = async (event) => {
  try {
    console.log("pathParameters:", event.pathParameters);

    const rawEmail = event.pathParameters?.email;

    if (!rawEmail) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Missing email." }),
      };
    }

    const email = decodeURIComponent(rawEmail);

    await client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { email },
        ConditionExpression: "attribute_exists(email)",
      }),
    );

    console.log(`User deleted successfully: ${email}`);

    return {
      statusCode: 204, // No Content
      headers: CORS_HEADERS,
      body: "",
    };
  } catch (err) {
    console.error("Error deleting user:", err);

    if (err.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "User not found." }),
      };
    }

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
