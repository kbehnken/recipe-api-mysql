'use strict';

require('dotenv').config();
const express = require('express');
const mysql = require('mysql')

const app = express();
const PORT = 4042;
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
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));