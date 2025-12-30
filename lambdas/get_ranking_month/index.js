const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { successResponse, serverErrorResponse } = require("../shared/httpUtils");
const { getDocumentClient, TABLES } = require("../shared/dbConfig");

const dynamo = getDocumentClient();
const TABLE = TABLES.GAMES;

// Retorna "YYYY-MM"
function getCurrentMonthPrefix() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

exports.handler = async (event) => {
  try {
    const queryMonth = event.queryStringParameters?.month;
    const month = queryMonth || getCurrentMonthPrefix();
    const pkValue = `MONTH#${month}`;

    // Busca apenas os jogos do mês atual
    const params = {
      TableName: TABLE,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": pkValue,
      },
    };

    const result = await dynamo.send(new QueryCommand(params));
    const monthGames = result.Items || [];

    // Ranking accumulator
    const ranking = {};

    function ensurePlayer(name) {
      if (!ranking[name]) {
        ranking[name] = {
          player: name,
          points: 0,
          matches: 0,
          wins: 0,
          losses: 0,
        };
      }
    }

    // Processar jogos
    monthGames.forEach((game) => {
      const winners = [game.winner1, game.winner2];
      const losers = [game.loser1, game.loser2];

      winners.forEach(ensurePlayer);
      losers.forEach(ensurePlayer);

      winners.forEach((player) => {
        ranking[player].points += 3;
        ranking[player].matches += 1;
        ranking[player].wins += 1;
      });

      losers.forEach((player) => {
        ranking[player].matches += 1;
        ranking[player].losses += 1;
      });
    });

    // Transformar para array e calcular eficiência
    const rankingArray = Object.values(ranking)
      .map((entry) => ({
        ...entry,
        efficiency:
          entry.matches > 0
            ? Number(((entry.wins / entry.matches) * 100).toFixed(2))
            : 0,
      }))
      .sort((a, b) => b.points - a.points);

    // Ranking estilo DENSE (1,1,2,2,3,...)
    let lastPoints = null;
    let currentRank = 0;

    rankingArray.forEach((r) => {
      if (r.points !== lastPoints) {
        currentRank += 1;
        lastPoints = r.points;
      }
      r.position = currentRank;
    });

    return successResponse(200, rankingArray);
  } catch (err) {
    console.error("Error generating ranking:", err);
    return serverErrorResponse("Error generating ranking");
  }
};
