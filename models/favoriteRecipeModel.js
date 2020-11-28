const sql = require('./db.js');

// Favorites to users constructor
const Favorite = function(favoriteRecipe) {
  this.recipe_id = favoriteRecipe.recipe_id;
  this.user_id = favoriteRecipe.user_id;
};

Favorite.createFavoriteRecipe = (newFavorite, result) => {
    sql.query('INSERT INTO favorites_to_users SET ?', newFavorite, (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      console.log('created favorite: ', { ...newFavorite });
      result(null, { ...newFavorite });
    });
  };

Favorite.findFavoritesByUserId = (user_id, result) => {
    sql.query(`SELECT r.recipe_id, r.recipe_name, r.user_id, Concat(u.first_name, ' ', u.last_name) AS contributor, r.photo_url, r.prep_time, r.cook_time
              FROM recipes AS r           
              LEFT JOIN 
                favorites_to_users AS f_to_u 
                ON r.recipe_id = f_to_u.recipe_id
              LEFT JOIN
                users as u
                ON f_to_u.user_id = u.user_id
              WHERE f_to_u.user_id = ${user_id}`, (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      result(null, res);
    });
};

Favorite.removeFavoriteRecipe = (recipe_id, user_id, result) => {
  sql.query(`DELETE FROM favorites_to_users WHERE recipe_id = ${recipe_id} AND user_id = ${user_id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // Recipe ID found
      result({ kind: 'not_found' }, null);
      return;
    }
    console.log('Successfully deleted recipe with id: ', recipe_id);
    result(null, res);
  });
};

module.exports = Favorite;