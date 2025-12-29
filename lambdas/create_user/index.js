const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require("bcryptjs");

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
    const role = event.requestContext?.authorizer?.role;
    if (role !== "admin") {
      return {
        statusCode: 403,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Access denied" }),
      };
    }

    const body = JSON.parse(event.body || "{}");

    if (!body.username || !body.email || !body.password) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: "Fields 'username', 'email' and 'password' are required.",
        }),
      };
    }

    const passwordHash = bcrypt.hashSync(body.password, 10);

    const now = Date.now();

    const item = {
      username: body.username,
      email: body.email,
      password_hash: passwordHash,
      role: body.role ?? "viewer",
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

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        username: item.username,
        email: item.email,
        role: item.role,
        active: item.active,
        createdAt: item.createdAt,
      }),
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
