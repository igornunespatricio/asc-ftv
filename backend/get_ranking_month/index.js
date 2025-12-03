const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.DYNAMODB_TABLE;

// Returns YYYY-MM (e.g., "2025-12")
function getCurrentMonthPrefix() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

exports.handler = async () => {
  try {
    const monthPrefix = getCurrentMonthPrefix();

    // Load all games
    const result = await dynamo.scan({ TableName: TABLE }).promise();
    const games = result.Items || [];

    // Filter games for current month
    const monthGames = games.filter((g) =>
      (g.match_date || "").startsWith(monthPrefix),
    );

    // Accumulator object: { player: { points, matches, wins, losses } }
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

    monthGames.forEach((game) => {
      const winners = [game.winner1, game.winner2];
      const losers = [game.loser1, game.loser2];

      // Ensure players exist
      winners.forEach(ensurePlayer);
      losers.forEach(ensurePlayer);

      // Update stats
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

    // Convert to array and sort
    const rankingArray = Object.values(ranking)
      .map((entry) => ({
        ...entry,
        efficiency:
          entry.matches > 0
            ? Number(((entry.wins / entry.matches) * 100).toFixed(2))
            : 0,
      }))
      .sort((a, b) => b.points - a.points);

    // Add position
    rankingArray.forEach((r, index) => {
      r.position = index + 1;
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(rankingArray),
    };
  } catch (err) {
    console.error("Error generating ranking:", err);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        message: "Error generating ranking",
        error: err.message,
      }),
    };
  }
};
