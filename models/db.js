require('dotenv').config();

const mysql = require('mysql')
const { HOST, DB, DB_USERNAME, DB_PASSWORD } = process.env;
const connection = mysql.createConnection({
    host: HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB
})
connection.connect(function(err) {
    if(err) {
        throw err;
    } else {
        console.log('DB connected');
    }
});

module.exports = connection;