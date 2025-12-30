const jwt = require("jsonwebtoken");

/**
 * Expected header:
 * Authorization: Bearer <token>
 */
exports.handler = async (event) => {
  try {
    const authHeader =
      event.headers?.Authorization || event.headers?.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return generatePolicy("anonymous", "Deny", event.methodArn);
    }

    const token = authHeader.replace("Bearer ", "");

    // ⚠️ Ideal: use AWS Secrets Manager or SSM Parameter Store
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return generatePolicy("anonymous", "Deny", event.methodArn);
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Handle role migration: viewer -> game_inputer for backward compatibility
    let role = decoded.role || "game_inputer";
    if (role === "viewer") {
      role = "game_inputer";
    }

    const user = {
      email: decoded.email,
      username: decoded.username || "",
      role: role,
    };

    console.log("Authorized user:", user);

    return generatePolicy(decoded.email, "Allow", event.methodArn, user);
  } catch (err) {
    console.error("Authorization error:", err.message);
    return generatePolicy("anonymous", "Deny", event.methodArn);
  }
};

/**
 * Generates IAM policy for API Gateway
 */
function generatePolicy(principalId, effect, methodArn, context = {}) {
  const arnParts = methodArn.split(":");
  const region = arnParts[3];
  const accountId = arnParts[4];

  const apiGatewayArnParts = arnParts[5].split("/");
  const restApiId = apiGatewayArnParts[0];
  const stage = apiGatewayArnParts[1];

  // 🔑 Libera TODOS os métodos e recursos do stage
  const resourceArn = `arn:aws:execute-api:${region}:${accountId}:${restApiId}/${stage}/*/*`;

  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resourceArn,
        },
      ],
    },
    context,
  };
}
