require('dotenv').config();

const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const maxTokenLifetime = '1h';
const signToken = function (data) {
    return jwt.sign(
        {
            email: data.email,
            user_id: data.user_id,
            first_name: data.first_name,
            last_name: data.last_name,
            is_admin: data.is_admin
        },
        accessTokenSecret,
        {
            expiresIn: maxTokenLifetime
        }
    );
}

module.exports = signToken;