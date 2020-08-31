require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

exports.login = (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email, (err, data) => {
       if (email === data.email && bcrypt.compareSync(password, data.password)) {
            // Generate json web token
            const accessToken = jwt.sign({ email: data.email, is_admin: data.is_admin }, accessTokenSecret, { expiresIn: '1h' });
            res.send({
                accessToken
            });
        } else {
            res.send('Login failed.');
        }
    });
}