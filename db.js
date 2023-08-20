const knex = require("knex");
const { getDatabaseUri } = require("./config");

const knexConfig = {
  client: "pg",
  connection: getDatabaseUri(),
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
};

const db = knex(knexConfig);

(async () => {
    try {
      await db.raw("SELECT 1");
      console.log("Database connection successful");
    } catch (error) {
      console.error("Error connecting to the database", error);
    }
  })();

module.exports = db;
