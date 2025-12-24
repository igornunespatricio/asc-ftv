const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

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
    const body = JSON.parse(event.body || "{}");

    if (!body.username || !body.email) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: "Fields 'username' and 'email' are required.",
        }),
      };
    }

    const item = {
      username: body.username,
      email: body.email,
      role: body.role ?? "viewer",
      active: body.active ?? true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
        ConditionExpression: "attribute_not_exists(email)",
      }),
    );

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify(item),
    };
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 409,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "User already exists." }),
      };
    }

    console.error("Error creating user:", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
