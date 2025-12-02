const { Pool, types } = require("pg");
require("dotenv").config();

// timestamp formatting fixed with ChatGPT using prompt: "The get endpoint returns the wrong start and end time. Help me fix it to display the correct time."
// 1114 = timestamp without time zone, 1184 = timestamptz
types.setTypeParser(1114, (val) => val); // keep as raw string
types.setTypeParser(1184, (val) => val); // also keep as string if you ever use timestamptz

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
