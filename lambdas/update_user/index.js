const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.USERS_TABLE;

// Valid roles for user assignment
const VALID_ROLES = ["admin", "game_inputer"];

// Cabeçalhos CORS padronizados
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

function requireAdmin(event) {
  const role = event.requestContext?.authorizer?.role;

  if (role !== "admin") {
    return {
      ok: false,
      response: {
        statusCode: 403,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Access denied" }),
      },
    };
  }

  return { ok: true };
}

exports.handler = async (event) => {
  console.log("pathParameters:", event.pathParameters);
  console.log("rawPath:", event.rawPath);

  try {
    const auth = requireAdmin(event);
    if (!auth.ok) return auth.response;

    const rawEmail = event.pathParameters?.email;

    if (!rawEmail) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Missing email in path." }),
      };
    }

    const email = decodeURIComponent(rawEmail);
    const body = JSON.parse(event.body || "{}");

    if (!email) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Missing email." }),
      };
    }

    if (
      body.username === undefined &&
      body.role === undefined &&
      body.active === undefined
    ) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Nothing to update." }),
      };
    }

    const updates = [];
    const values = {};
    const names = {};

    if (body.username !== undefined) {
      updates.push("username = :username");
      values[":username"] = body.username;
    }

    if (body.role !== undefined) {
      // Validate role before updating
      if (!VALID_ROLES.includes(body.role)) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            message: `Invalid role '${body.role}'. Valid roles are: ${VALID_ROLES.join(", ")}`,
          }),
        };
      }
      updates.push("#role = :role");
      values[":role"] = body.role;
      names["#role"] = "role";
    }

    if (body.active !== undefined) {
      updates.push("active = :active");
      values[":active"] = body.active;
    }

    updates.push("updatedAt = :updatedAt");
    values[":updatedAt"] = Date.now();

    const result = await client.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { email },
        UpdateExpression: `SET ${updates.join(", ")}`,
        ExpressionAttributeValues: values,
        ExpressionAttributeNames: Object.keys(names).length ? names : undefined,
        ConditionExpression: "attribute_exists(email)",
        ReturnValues: "ALL_NEW",
      }),
    );

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: "User updated successfully.",
        user: result.Attributes,
      }),
    };
  } catch (err) {
    console.error("Error updating user:", err);

    if (err.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "User not found." }),
      };
    }

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
