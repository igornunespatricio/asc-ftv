const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.PLAYERS_TABLE;

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body);

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing ID" }),
      };
    }

    if (!body.name && body.nickname === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Nothing to update." }),
      };
    }

    const updates = [];
    const values = {};

    if (body.name) {
      updates.push("name = :name");
      values[":name"] = body.name;
    }

    if (body.nickname !== undefined) {
      updates.push("nickname = :nick");
      values[":nick"] = body.nickname;
    }

    updates.push("updatedAt = :updatedAt");
    values[":updatedAt"] = Date.now();

    await client.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${updates.join(", ")}`,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW",
      }),
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Player updated." }),
    };
  } catch (err) {
    console.error("Error updating player:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
