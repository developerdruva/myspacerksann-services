const { Pool } = require('pg');
const pg = require('pg');

let awsPostgres = {
    user: process.env.NEON_POSTGRES_USER,
    host: process.env.NEON_POSTGRES_HOST,
    database: process.env.NEON_POSTGRES_DATABASE,
    password: process.env.NEON_POSTGRES_PASSWORD,
    port: process.env.NEON_POSTGRES_PORT,
    ssl: {
        rejectUnauthorized: false
    },
    dialectOptions: {
        ssl: true
    }
}


const POOL = new Pool(awsPostgres);

module.exports = POOL;
