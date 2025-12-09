import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.PLAYERS_TABLE;

export const handler = async (event) => {
  try {
    const { id } = event.pathParameters;

    if (!id) {
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

    return {
      statusCode: 204,
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
