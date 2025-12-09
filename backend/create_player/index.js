import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.PLAYERS_TABLE;

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    if (!body.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Field 'name' is required." }),
      };
    }

    const item = {
      id: uuidv4(),
      name: body.name,
      nickname: body.nickname ?? null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      }),
    );

    return {
      statusCode: 201,
      body: JSON.stringify(item),
    };
  } catch (err) {
    console.error("Error creating player:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
