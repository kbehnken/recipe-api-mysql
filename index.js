'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const expressJwt = require('express-jwt');

const PORT = 4042;

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// auth middleware
const jwtOptions = {
    secret: accessTokenSecret,
    algorithms: ['HS256']
}
const unauthenticatedRoutes = {
    path: ['/api/v1/login']
}
app.use(expressJwt(jwtOptions)
.unless(unauthenticatedRoutes));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const authRte = require('./routes/authRoutes');
authRte(app);
const userRte = require('./routes/userRoutes.js');
userRte(app);
const recipeRte = require('./routes/recipeRoutes.js');
recipeRte(app);
const ingredientRte = require('./routes/ingredientRoutes.js');
ingredientRte(app);