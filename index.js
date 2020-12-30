'use strict';

require('dotenv').config();

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.SERVER_PORT;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const expressJwt = require('express-jwt');

// Parse requests of content-type: application/json
app.use(bodyParser.json());

// Parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Auth middleware
const jwtOptions = {
    secret: accessTokenSecret,
    algorithms: ['HS256']
}
const unauthenticatedRoutes = {
    path: ['/api/v1/login']
}
app.use(expressJwt(jwtOptions)
.unless(unauthenticatedRoutes));

app.use(cors({origin: '*'}));

app.listen(port, () => console.log(`Listening on ` + port));

// Routes
const authRte = require('./routes/authRoutes');
authRte(app);
const userRte = require('./routes/userRoutes.js');
userRte(app);
const recipeRte = require('./routes/recipeRoutes.js');
recipeRte(app);