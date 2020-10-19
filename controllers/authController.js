require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const maxTokenLifetime = '1h';

exports.login = (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email, (err, data) => {
        if (err) {
            res.status(500).send({err: 'Something went wrong.'});
            return;
        }
        if (email === data.email && bcrypt.compareSync(password, data.password)) {
            // Generate json web token
            const accessToken = jwt.sign({ email: data.email, user_id: data.user_id, first_name: data.first_name, last_name: data.last_name, is_admin: data.is_admin }, accessTokenSecret, { expiresIn: maxTokenLifetime });
            res.status(200).send({
                accessToken
            });
        } else {
            res.status(401).send({err: 'Login failed.'});
        }
    });
}