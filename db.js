const knex = require("knex");
const config = require('./config');

const getConnString = () => {
return `postgresql://localhost:5432/${process.env.NODE_ENV === "test" ? "your_store_test" : "your_store"}`
}

const knexConfig = {
  client: "pg",
  
  connection: {
    connectionString: getConnString()
  },
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
};

const db = knex(knexConfig);

(async () => {
  try {
    const currentDatabaseResult = await db.raw("SELECT current_database()");
    const currentDatabase = currentDatabaseResult.rows[0].current_database;

    const inetServerAddrResult = await db.raw("SELECT inet_server_addr()");
    const inetServerAddr = inetServerAddrResult.rows[0].inet_server_addr;

    console.log(`Connected to database: ${currentDatabase}`);
    console.log(`Connected to host: ${inetServerAddr}`);
    
    await db.raw("SELECT 1"); // Perform a test query
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
})();

module.exports = db;



