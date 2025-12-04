// migrate_v2.js
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

const oldTable = "futevolei-games";
const newTable = "futevolei-games-v2";

const dynamo = new AWS.DynamoDB.DocumentClient();

/* ------------------------ Helpers ------------------------ */

async function scanAll(tableName) {
  let items = [];
  let lastKey = undefined;

  do {
    const res = await dynamo
      .scan({
        TableName: tableName,
        ExclusiveStartKey: lastKey,
      })
      .promise();

    items = items.concat(res.Items || []);
    lastKey = res.LastEvaluatedKey;
  } while (lastKey);

  return items;
}

function toNewItem(old) {
  const match_date = old.match_date || "";
  const month = match_date.slice(0, 7) || "unknown";
  const id = old.id || crypto.randomBytes(8).toString("hex");

  return {
    PutRequest: {
      Item: {
        pk: `MONTH#${month}`,
        sk: `${match_date}#${id}`,
        id,
        ...old,
      },
    },
  };
}

async function batchWrite(requests) {
  const BATCH = 25;

  for (let i = 0; i < requests.length; i += BATCH) {
    const batch = requests.slice(i, i + BATCH);

    let params = {
      RequestItems: {
        [newTable]: batch,
      },
    };

    let retries = 0;

    while (true) {
      const res = await dynamo.batchWrite(params).promise();

      if (
        !res.UnprocessedItems ||
        Object.keys(res.UnprocessedItems).length === 0
      ) {
        break;
      }

      console.log(
        `⚠ Retrying ${Object.keys(res.UnprocessedItems).length} unprocessed items...`,
      );

      params.RequestItems = res.UnprocessedItems;
      retries++;
      await new Promise((r) => setTimeout(r, 500 * retries));
    }

    console.log(`✔ Batch migrated (${i + 1}/${requests.length})`);
  }
}

/* ------------------------ Main ------------------------ */

(async () => {
  try {
    console.log("📥 Lendo tabela antiga...");
    const oldItems = await scanAll(oldTable);
    console.log(`Encontrados ${oldItems.length} itens.`);

    console.log("🔄 Convertendo itens para o novo formato...");
    const writeRequests = oldItems.map(toNewItem);

    console.log("📤 Migrando para a nova tabela...");
    await batchWrite(writeRequests);

    console.log("🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!");
  } catch (err) {
    console.error("❌ Erro durante a migração:", err);
    process.exit(1);
  }
})();
