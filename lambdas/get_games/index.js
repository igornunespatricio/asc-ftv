const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { successResponse, serverErrorResponse } = require("../shared/httpUtils");

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const TABLE = process.env.GAMES_TABLE;

// Retorna "YYYY-MM"
function getCurrentMonthPrefix() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

exports.handler = async (event) => {
  const requestedMonth = event.queryStringParameters?.month;
  const month = requestedMonth || getCurrentMonthPrefix();
  const pkValue = `MONTH#${month}`;

  const params = {
    TableName: TABLE,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": pkValue,
    },
  };

  try {
    const result = await dynamo.send(new QueryCommand(params));
    return successResponse(200, result.Items);
  } catch (err) {
    console.error("DynamoDB error:", err);
    return serverErrorResponse("Error querying games");
  }
};
