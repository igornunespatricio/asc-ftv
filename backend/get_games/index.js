const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.DYNAMODB_TABLE;

exports.handler = async () => {
  const result = await dynamo.scan({ TableName: TABLE }).promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(result.Items)
  };
};
