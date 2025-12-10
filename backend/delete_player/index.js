const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DeleteCommand } = require("@aws-sdk/lib-dynamodb");

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
    const { id } = event.pathParameters || {};

    console.log("DELETE PLAYER REQUEST:", {
      id,
      table: TABLE_NAME,
      rawEvent: event,
    });

    if (!id) {
      console.log("Delete aborted — missing ID in the pathParameters");
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Missing ID" }),
      };
    }

    await client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
      }),
    );

    console.log(`Player deleted successfully: ${id}`);

    return {
      statusCode: 204, // No content
      headers: CORS_HEADERS,
      body: "",
    };
  } catch (err) {
    console.error("Error deleting player:", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
