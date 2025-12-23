const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
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
    const result = await dynamo.query(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(result.Items),
    };
  } catch (err) {
    console.error("DynamoDB error:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Error querying games" }),
    };
  }
};
