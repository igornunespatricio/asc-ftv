console.log("=== Lambda Layer Debug ===");
console.log("NODE_PATH:", process.env.NODE_PATH);
console.log("Available modules in require.resolve.paths:");
try {
  console.log(
    "shared-utils paths:",
    require.resolve.paths ? require.resolve.paths("shared-utils") : "N/A",
  );
} catch (e) {
  console.log("Error checking shared-utils paths:", e.message);
}

// Try to check filesystem
const fs = require("fs");
try {
  const optContents = fs.readdirSync("/opt");
  console.log("/opt contents:", optContents);

  if (optContents.includes("nodejs")) {
    const nodejsContents = fs.readdirSync("/opt/nodejs");
    console.log("/opt/nodejs contents:", nodejsContents);

    if (nodejsContents.includes("node_modules")) {
      const nodeModulesContents = fs.readdirSync("/opt/nodejs/node_modules");
      console.log("/opt/nodejs/node_modules contents:", nodeModulesContents);

      if (nodeModulesContents.includes("shared-utils")) {
        console.log("✅ shared-utils module found!");
        const sharedUtilsContents = fs.readdirSync(
          "/opt/nodejs/node_modules/shared-utils",
        );
        console.log(
          "/opt/nodejs/node_modules/shared-utils contents:",
          sharedUtilsContents,
        );
      } else {
        console.log(
          "❌ shared-utils module NOT found in /opt/nodejs/node_modules",
        );
      }
    } else {
      console.log("❌ node_modules directory NOT found in /opt/nodejs");
    }
  } else {
    console.log("❌ nodejs directory NOT found in /opt");
  }
} catch (fsError) {
  console.log("Filesystem check error:", fsError.message);
}

console.log("=== End Lambda Layer Debug ===");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const {
  successResponse,
  errorResponse,
  serverErrorResponse,
  getDocumentClient,
  TABLES,
  JWT_SECRET,
  validateRequest,
} = require("shared-utils");

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
