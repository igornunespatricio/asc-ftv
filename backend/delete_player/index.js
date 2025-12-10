const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.PLAYERS_TABLE;

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
      body: "",
    };
  } catch (err) {
    console.error("Error deleting player:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
