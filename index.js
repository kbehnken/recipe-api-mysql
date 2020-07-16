'use strict';
// require('dotenv').config();

const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = 4042;

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// const mysql = require('mysql')
// const { HOST, DB, DB_USERNAME, DB_PASSWORD } = process.env;
// const connection = mysql.createConnection({
//     host: HOST,
//     user: DB_USERNAME,
//     password: DB_PASSWORD,
//     database: DB
// })
// connection.connect(function(err) {
//     if(err) {
//         throw err;
//     } else {
//         console.log('DB connected');
//     }
// });

// const authRte = require('./routes/authRoutes');
// authRte(app);
// const userRte = require('./routes/userRoutes.js');
// userRte(app);
const recipeRte = require('./routes/recipeRoutes.js');
recipeRte(app);
const ingredientRte = require('./routes/ingredientRoutes.js');
ingredientRte(app);