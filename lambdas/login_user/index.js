const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const {
  successResponse,
  errorResponse,
  serverErrorResponse,
} = require("../shared/httpUtils");
const { getDocumentClient, TABLES, JWT_SECRET } = require("../shared/dbConfig");
const { validateRequest } = require("../shared/validationUtils");

const ddb = getDocumentClient();
const USERS_TABLE = TABLES.USERS;

exports.handler = async (event) => {
  try {
    // Validate request
    const validation = validateRequest(event, {
      requiredBodyFields: ["email", "password"],
    });
    if (!validation.ok) return validation.response;

    const { email, password } = validation.body;

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
