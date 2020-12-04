const bcrypt = require('bcrypt');
const signToken = require('../helpers/signToken.js');
const User = require('../models/userModel.js');

// Create and save a new user
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: 'Content cannot be empty.'
        });
    }

    // Create a user
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        is_admin: req.body.is_admin
    });

    // Save user in the database
    User.create(user, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || 'An error occurred while attempting to create this user.'
            });
        } else {
            res.send(data);
        }
    });
};

// Return all users from the database
exports.findAll = (req, res) => {
    User.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || 'An error occurred while attempting to retrieve recipes.'
            });
        } else {
            res.status(200).send(data);
        }
    });
};
  
// Return a single user profile with a userId
exports.findOne = (req, res) => {
    User.findById(req.params.userId, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                res.status(404).send({
                    message: `User with id ${req.params.userId} not found.`
                });
            } else {
                res.status(500).send({
                    message: `An error occurred while attempting to retrieve user with id ${req.params.userId}.`
                });
            }
        } else res.status(200).send(data);
    });
};
  
// Update a user profile with the userId specified in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: 'Content cannot be empty!'
        });
    }
    User.updateById(req.params.userId, new User(req.body), (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                res.status(404).send({
                    message: `User with id ${req.params.userId} not found.`
                });
            } else {
                res.status(500).send({
                    message: `An error occurred while attempting to update user with id ${req.params.userId}.`
                });
            }
        } else {
            data.user_id = req.params.userId;
            const accessToken = signToken(data);
            data.accessToken = accessToken;
            res.send(data);
        }
    });
};
  
// Delete a user profile with the userId specified in the request
exports.delete = (req, res) => {
    User.remove(req.params.userId, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                res.status(404).send({ 
                    message: `User with id ${req.params.userId} not found.`
                });
            } else {
                res.status(500).send({ 
                    message: `Cannot delete user with id ${req.params.userId}.`
                });
        }
        } else {
            res.status(200).send({ 
                message: `User was successfully deleted!`
            });
        }
    });
};

// Update a user password for the userId specified in the request
exports.updatePassword = async (req, res) => {
    const newPassword = bcrypt.hashSync(req.body.newPassword, 10);
    const oldPassword = req.body.password;
    const { user_id } = req.user;
    
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: 'Content cannot be empty!'
        });
    }
    if (req.body.newPassword.length < 12) {
        return res.status(400).send({
            message: 'Password does not meet minimum length requirement!'
        });
    }
    const [result] = await User.findById(user_id);
    if (!bcrypt.compareSync(oldPassword, result[0].password)) {
        return res.status(401).send('Password comparison failed.');
    }
    return User.updatePassword(user_id, newPassword)
    .then(() => {
        res.status(200).send('Password updated!');
    });
};