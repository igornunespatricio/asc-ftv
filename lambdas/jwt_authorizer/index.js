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

    /**
     * Expected payload example:
     * {
     *   sub: "user-id",
     *   role: "admin",
     *   email: "user@email.com"
     * }
     */

    return generatePolicy(decoded.sub, "Allow", event.methodArn, {
      userId: decoded.sub,
      role: decoded.role || "user",
      email: decoded.email || "",
    });
  } catch (err) {
    console.error("Authorization error:", err.message);
    return generatePolicy("anonymous", "Deny", event.methodArn);
  }
};

/**
 * Generates IAM policy for API Gateway
 */
function generatePolicy(principalId, effect, resource, context = {}) {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };
}
