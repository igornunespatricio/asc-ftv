const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.PLAYERS_TABLE;

// -------------------------
// CORS headers
// -------------------------
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body);

    if (!id) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Missing ID" }),
      };
    }

    if (!body.name && body.nickname === undefined) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Nothing to update." }),
      };
    }

    const updates = [];
    const values = {};

    if (body.name) {
      updates.push("#name = :name");
      values[":name"] = body.name;
    }

    if (body.nickname !== undefined) {
      updates.push("nickname = :nick");
      values[":nick"] = body.nickname;
    }

    updates.push("updatedAt = :updatedAt");
    values[":updatedAt"] = Date.now();

    const result = await client.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${updates.join(", ")}`,
        ExpressionAttributeValues: values,
        ExpressionAttributeNames: { "#name": "name" },
        ReturnValues: "ALL_NEW",
      }),
    );

    console.log("Player updated successfully:", result.Attributes);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: "Player updated.",
        player: result.Attributes,
      }),
    };
  } catch (err) {
    console.error("Error updating player:", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
