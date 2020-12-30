require('dotenv').config();

const mysql = require('mysql2')
const { HOST, DB, DB_USERNAME, DB_PASSWORD } = process.env;
const connection = mysql.createPool({
    host: HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB
})

module.exports = connection;