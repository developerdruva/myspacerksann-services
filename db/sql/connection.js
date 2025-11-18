const { Pool } = require("pg");
const pg = require("pg");
// const { dbConnServer } = require('../../utils/commonUtils');
const dbConnServer = process.env.DB_SERVER;

let DBCONN_DEV = {
  user: process.env.NEON_PG_USER,
  host: process.env.NEON_PG_HOST,
  database: process.env.NEON_PG_DATABASE,
  password: process.env.NEON_PG_PASSWORD,
  port: process.env.NEON_PG_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
  dialectOptions: {
    ssl: true,
  },
};
let DBCONN_PROD = {
  user: process.env.PROD_NEON_PG_USER,
  host: process.env.PROD_NEON_PG_HOST,
  database: process.env.PROD_NEON_PG_DATABASE,
  password: process.env.PROD_NEON_PG_PASSWORD,
  port: process.env.PROD_NEON_PG_PORT,
  ssl: { 
    rejectUnauthorized: false,
  },
  dialectOptions: {
    ssl: true,
  },
};

let POOL;

if (dbConnServer == "dev") {
  console.log("in db server dev");
  POOL = new Pool(DBCONN_DEV);
  console.log("in db server dev----", DBCONN_DEV);
} else if (dbConnServer == "prod") {
  console.log("in db server prod");
  POOL = new Pool(DBCONN_PROD);
}

module.exports = POOL;
