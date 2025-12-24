const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.USERS_TABLE;

// Cabeçalhos CORS padronizados
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

exports.handler = async () => {
  try {
    const result = await client.send(
      new ScanCommand({ TableName: TABLE_NAME }),
    );

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(result.Items || []),
    };
  } catch (err) {
    console.error("Error listing players:", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
