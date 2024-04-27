const { Pool } = require('pg');
const pg = require('pg');

let awsPostgres = {
    user: process.env.AWS_POSTGRES_USER,
    host: process.env.AWS_POSTGRES_HOST,
    database: process.env.AWS_POSTGRES_DATABASE,
    password: process.env.AWS_POSTGRES_PASSWORD,
    port: process.env.AWS_POSTGRES_PORT,
    ssl: {
        rejectUnauthorized: false
    },
    dialectOptions: {
        ssl: true
    }
}


const POOL = new Pool(awsPostgres);

module.exports = POOL;
