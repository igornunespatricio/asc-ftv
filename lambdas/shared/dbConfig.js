const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// Table name constants - centralized table configuration
const TABLES = Object.freeze({
  GAMES: process.env.GAMES_TABLE,
  USERS: process.env.USERS_TABLE,
});

// JWT secret for authentication
const JWT_SECRET = process.env.JWT_SECRET;

// Shared DynamoDB client instances (singleton pattern)
let dynamoClient = null;
let documentClient = null;

/**
 * Get shared DynamoDB client instance
 * Uses singleton pattern for connection reuse and memory efficiency
 */
function getDynamoClient() {
  if (!dynamoClient) {
    dynamoClient = new DynamoDBClient({
      // Future configuration options can be added here:
      // region: process.env.AWS_REGION,
      // maxAttempts: 3,
      // requestTimeout: 5000,
    });
  }
  return dynamoClient;
}

/**
 * Get shared DynamoDB DocumentClient instance
 * Uses singleton pattern for connection reuse and memory efficiency
 */
function getDocumentClient() {
  if (!documentClient) {
    documentClient = DynamoDBDocumentClient.from(getDynamoClient());
  }
  return documentClient;
}

module.exports = {
  TABLES,
  JWT_SECRET,
  getDynamoClient,
  getDocumentClient,
};
