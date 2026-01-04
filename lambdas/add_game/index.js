const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const {
  successResponse,
  accessDeniedResponse,
  serverErrorResponse,
  requireAdminOrGameInputer,
  getDocumentClient,
  TABLES,
  validateRequest,
  validateGameData,
} = require("shared-utils");

const dynamo = getDocumentClient();
const tableName = TABLES.GAMES;

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  // Check authorization
  const auth = requireAdminOrGameInputer(event);
  if (!auth.ok) return auth.response;

  // Validate request and game data
  const validation = validateRequest(event, {
    requiredBodyFields: [
      "match_date",
      "winner1",
      "winner2",
      "loser1",
      "loser2",
    ],
  });
  if (!validation.ok) return validation.response;

  const gameValidation = validateGameData(validation.body);
  if (!gameValidation.ok) return gameValidation.response;

  const {
    match_date,
    winner1,
    winner2,
    loser1,
    loser2,
    score_winner,
    score_loser,
  } = validation.body;

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
