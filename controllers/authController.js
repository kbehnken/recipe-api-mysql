const bcrypt = require('bcrypt');
const signToken = require('../helpers/signToken.js');
const User = require('../models/userModel.js');

exports.login = (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email, (err, data) => {
        if (err) {
            res.status(500).send({err: 'Something went wrong.'});
            return;
        }
        if (email === data.email && bcrypt.compareSync(password, data.password)) {
            // Generate json web token
            const accessToken = signToken(data);
            res.status(200).send({
                accessToken
            });
        } else {
            res.status(401).send({err: 'Login failed.'});
        }
    });
}