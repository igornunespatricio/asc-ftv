const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const {
  successResponse,
  errorResponse,
  badRequestResponse,
  serverErrorResponse,
} = require("../shared/httpUtils");

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

const USERS_TABLE = process.env.USERS_TABLE;
const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email, password } = body;

    if (!email || !password) {
      return badRequestResponse("Email e senha são obrigatórios");
    }

    // Buscar usuário
    const result = await ddb.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { email },
      }),
    );

    if (!result.Item || !result.Item.active) {
      return errorResponse(401, "Usuário ou senha inválidos");
    }

    const validPassword = await bcrypt.compare(
      password,
      result.Item.password_hash,
    );

    if (!validPassword) {
      return errorResponse(401, "Usuário ou senha inválidos");
    }

    // Gerar JWT
    const token = jwt.sign(
      {
        email: result.Item.email,
        username: result.Item.username,
        role: result.Item.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return successResponse(200, { token });
  } catch (err) {
    console.error(err);
    return serverErrorResponse("Erro interno");
  }
};
