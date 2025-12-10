const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.PLAYERS_TABLE;

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

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
