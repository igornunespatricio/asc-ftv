// migrate_roles_v3.js
// Updates user roles: "viewer" -> "game_inputer", keeps "admin" unchanged

const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

const dynamo = new AWS.DynamoDB.DocumentClient();

// Configuration - Update these as needed
const USERS_TABLE = process.env.USERS_TABLE || "asc-ftv-dev-users";
const DRY_RUN = process.env.DRY_RUN === "true"; // Set to true to preview changes without applying

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

function migrateUserRole(user) {
  const now = Date.now();
  let needsUpdate = false;
  const originalRole = user.role;

  // Update role: viewer -> game_inputer
  if (user.role === "viewer") {
    user.role = "game_inputer";
    needsUpdate = true;
  }

  // Add timestamps if missing (for consistency)
  if (!user.createdAt) {
    user.createdAt = now;
    needsUpdate = true;
  }

  if (!user.updatedAt) {
    user.updatedAt = now;
    needsUpdate = true;
  }

  return needsUpdate
    ? { user, originalRole, changes: user.role !== originalRole }
    : null;
}

async function batchWrite(requests) {
  const BATCH = 25;

  for (let i = 0; i < requests.length; i += BATCH) {
    const batch = requests.slice(i, i + BATCH);

    let params = {
      RequestItems: {
        [USERS_TABLE]: batch,
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

/* ------------------------ Validation ------------------------ */

function validateUsers(users) {
  const roleCounts = {};
  const invalidRoles = [];

  users.forEach((user) => {
    const role = user.role;
    roleCounts[role] = (roleCounts[role] || 0) + 1;

    if (!["admin", "viewer", "game_inputer"].includes(role)) {
      invalidRoles.push({ email: user.email, role });
    }
  });

  console.log("📊 Current role distribution:");
  Object.entries(roleCounts).forEach(([role, count]) => {
    console.log(`  ${role}: ${count} users`);
  });

  if (invalidRoles.length > 0) {
    console.error("❌ Found users with unexpected roles:");
    invalidRoles.forEach((user) => {
      console.error(`  ${user.email}: ${user.role}`);
    });
    throw new Error("Unexpected roles found. Migration aborted for safety.");
  }

  return roleCounts;
}

/* ------------------------ Main ------------------------ */

(async () => {
  try {
    console.log(`🔍 Scanning users table: ${USERS_TABLE}`);

    if (DRY_RUN) {
      console.log("🔍 DRY RUN MODE - No changes will be applied");
    }

    const users = await scanAll(USERS_TABLE);
    console.log(`📋 Found ${users.length} users`);

    // Validate current state
    const roleCounts = validateUsers(users);
    const viewersToMigrate = roleCounts.viewer || 0;

    if (viewersToMigrate === 0) {
      console.log(
        "ℹ️ No users with 'viewer' role found. Migration may already be complete.",
      );
      return;
    }

    console.log(
      `📝 Will migrate ${viewersToMigrate} users from 'viewer' to 'game_inputer'`,
    );

    // Prepare migration
    const writeRequests = [];

    users.forEach((user) => {
      const migrationResult = migrateUserRole(user);

      if (migrationResult) {
        const { user: migratedUser, originalRole } = migrationResult;
        writeRequests.push({
          PutRequest: {
            Item: migratedUser,
          },
        });

        if (DRY_RUN) {
          const changeType =
            originalRole !== migratedUser.role ? "role" : "timestamps";
          console.log(
            `🔄 Would update ${user.email}: ${originalRole} -> ${migratedUser.role} (${changeType})`,
          );
        }
      }
    });

    if (writeRequests.length === 0) {
      console.log("ℹ️ No users need updates");
      return;
    }

    console.log(`📤 Prepared ${writeRequests.length} update requests`);

    if (DRY_RUN) {
      console.log("🔍 Dry run complete. Set DRY_RUN=false to apply changes.");
      return;
    }

    // Apply changes
    console.log("🚀 Starting migration...");
    await batchWrite(writeRequests);

    console.log("🎉 ROLE MIGRATION COMPLETED SUCCESSFULLY!");
    console.log(
      `✅ Updated ${viewersToMigrate} users from 'viewer' to 'game_inputer'`,
    );
    console.log(`✅ Added timestamps to users missing them`);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  }
})();
