const sql = require('./db.js');

// constructor
const User = function(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.password = user.password;
    this.is_admin = user.is_admin;
    this.created_at = new Date();
};

User.create = (newUser, result) => {
    sql.query('INSERT INTO users SET ?', newUser, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        console.log('created user: ', { id: res.insertId, ...newUser });
        result(null, { id: res.insertId, ...newUser });
    });
};

User.findByEmail = (email, result) => {
    sql.query(`SELECT * FROM users WHERE email = '${email}'`, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
  
        if (res.length) {
            console.log('found user: ', res[0]);
            result(null, res[0]);
            return;
        }
        // User ID not found
        result({ kind: 'not_found' }, null);
    });
};

User.findById = (user_id, result) => {
    sql.query(`SELECT * FROM users WHERE user_id = ${user_id}`, (err, res) => {
        if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
        }

        if (res.length) {
        console.log('found user: ', res[0]);
        result(null, res[0]);
        return;
        }
        // User ID not found
        result({ kind: 'not_found' }, null);
    });
};

User.getAll = result => {
    sql.query('SELECT * FROM users', (err, res) => {
        if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
        }

        console.log('users: ', res);
        result(null, res);
    });
};

User.updateById = (user_id, user, result) => {
    sql.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? WHERE user_id = ?',[user.first_name, user.last_name, user.email, user.password, user_id], (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // User ID not found
            result({ kind: 'not_found' }, null);
            return;
        }
        console.log('updated user: ', { user_id: user_id, ...user });
        result(null, { user_id: user_id, ...user });
    });
};

User.remove = (user_id, result) => {
    sql.query('DELETE FROM users WHERE user_id = ?', user_id, (err, res) => {
        if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
        }

        if (res.affectedRows == 0) {
        // User ID found
        result({ kind: 'not_found' }, null);
        return;
        }

        console.log('Successfully deleted user with id: ', user_id);
        result(null, res);
    });
};

// module.exports = {
//     firstName: 'Maddy',
//     lastName: 'Behnken',
//     email: 'maddy@gmail.com',
//     password: '1234'
// };

module.exports = User;