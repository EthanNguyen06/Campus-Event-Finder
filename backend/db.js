// const { Pool } = require("pg");
// require("dotenv").config();

// const databaseUrl = process.env.DATABASE_URL;

// // Detect if the connection string points to Supabase
// const isSupabase = databaseUrl && databaseUrl.includes("supabase.co");

// const pool = new Pool({
//   connectionString: databaseUrl,
//   ssl: isSupabase
//     ? { rejectUnauthorized: false } // enable SSL for Supabase
//     : false                         // disable SSL for local Postgres
// });

// module.exports = pool;

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

module.exports = pool;

