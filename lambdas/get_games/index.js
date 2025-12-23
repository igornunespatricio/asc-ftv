const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.GAMES_TABLE;

// Retorna "YYYY-MM"
function getCurrentMonthPrefix() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// Cabeçalhos CORS padronizados
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

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
      headers: CORS_HEADERS,
      body: JSON.stringify(result.Items),
    };
  } catch (err) {
    console.error("DynamoDB error:", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Error querying games" }),
    };
  }
};
