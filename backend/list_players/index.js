import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.PLAYERS_TABLE;

export const handler = async () => {
  try {
    const result = await client.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      }),
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items || []),
    };
  } catch (err) {
    console.error("Error listing players:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
