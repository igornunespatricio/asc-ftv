const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
};

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event));

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (err) {
        console.error("Invalid JSON:", err);
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Invalid JSON payload" }),
        };
    }

    const { match_date, winner1, winner2, loser1, loser2, score_winner, score_loser } = body;

    // Validação dos campos obrigatórios
    if (!match_date || !winner1 || !winner2 || !loser1 || !loser2) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Missing required fields" }),
        };
    }

    const item = {
        id: uuidv4(),
        match_date,
        winner1,
        winner2,
        loser1,
        loser2,
        score_winner: score_winner !== undefined && score_winner !== "" ? Number(score_winner) : null,
        score_loser: score_loser !== undefined && score_loser !== "" ? Number(score_loser) : null,
        created_at: new Date().toISOString(),
    };

    try {
        await dynamo.put({ TableName: tableName, Item: item }).promise();
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(item),
        };
    } catch (err) {
        console.error("DynamoDB error:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error saving game" }),
        };
    }
};
