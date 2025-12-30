const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const {
  successResponse,
  accessDeniedResponse,
  badRequestResponse,
  serverErrorResponse,
} = require("../shared/httpUtils");
const { getDocumentClient, TABLES } = require("../shared/dbConfig");

const dynamo = getDocumentClient();
const tableName = TABLES.GAMES;

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  const role = event.requestContext?.authorizer?.role;

  if (role !== "admin" && role !== "game_inputer") {
    return accessDeniedResponse();
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    console.error("Invalid JSON:", err);
    return badRequestResponse("Invalid JSON payload");
  }

  const {
    match_date,
    winner1,
    winner2,
    loser1,
    loser2,
    score_winner,
    score_loser,
  } = body;

  if (!match_date || !winner1 || !winner2 || !loser1 || !loser2) {
    return badRequestResponse("Missing required fields");
  }

  const month = match_date.slice(0, 7);
  const id = uuidv4();

  const item = {
    pk: `MONTH#${month}`,
    sk: `${match_date}#${id}`,
    id,
    match_date,
    winner1,
    winner2,
    loser1,
    loser2,
    score_winner: score_winner ? Number(score_winner) : null,
    score_loser: score_loser ? Number(score_loser) : null,
    created_at: new Date().toISOString(),
  };

  try {
    await dynamo.send(new PutCommand({ TableName: tableName, Item: item }));
    return successResponse(200, item);
  } catch (err) {
    console.error("DynamoDB error:", err);
    return serverErrorResponse("Error saving game");
  }
};
