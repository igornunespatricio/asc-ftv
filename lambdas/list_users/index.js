exports.handler = async () => {
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  try {
    const result = await client.send(
      new ScanCommand({ TableName: TABLE_NAME }),
    );

    return {
      statusCode: 200,
      headers: CORS_HEADERS, // ⚠️ aqui
      body: JSON.stringify(result.Items || []),
    };
  } catch (err) {
    console.error("Error listing players:", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS, // ⚠️ aqui também
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
