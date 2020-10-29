const sql = require('./db.js');

// Recipe constructor
const Recipe = function(recipe) {
  this.recipe_id = recipe.recipe_id;
  this.user_id = recipe.user_id;
  this.recipe_name = recipe.recipe_name;
  this.contributor = recipe.contributor;
  this.photo_url = recipe.photo_url;
  this.prep_time = recipe.prep_time;
  this.cook_time = recipe.cook_time;
  this.ingredients = recipe.ingredients;
  this.directions = recipe.directions;
};

Recipe.create = (newRecipe, result) => {
  sql.query(`INSERT INTO recipes (user_id, recipe_name, photo_url, prep_time, cook_time, directions, created_at) VALUES ('${newRecipe.user_id}', '${newRecipe.recipe_name}', '${newRecipe.photo_url}', '${newRecipe.prep_time}', '${newRecipe.cook_time}', '${newRecipe.directions}', Now())`, newRecipe, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    newRecipe.recipe_id = res.insertId
    result(null,newRecipe);
  });
};

Recipe.setIngredients = (newRecipe, result) => {
  for (let i=0; i < newRecipe.ingredients.length; i++) {
    const { ingredient_name, quantity } = newRecipe.ingredients[i];
    const { recipe_id } = newRecipe;
    sql.query(`INSERT INTO ingredients SET ingredient_name = '${ingredient_name}', quantity = '${quantity}', recipe_id = ${recipe_id}`, (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
    });
  }
  result(null, newRecipe);
};

Recipe.findAll = result => {
  sql.query(`SELECT r.recipe_id, r.recipe_name, r.user_id, Concat(u.first_name, ' ', u.last_name) AS contributor, r.photo_url, r.prep_time, r.cook_time
  FROM recipes AS r           
  LEFT JOIN
    users as u
    ON r.user_id = u.user_id`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    console.log('recipes: ', res);
    result(null, res);
  });
};

Recipe.findByRecipeId = (recipe_id, user_id, result) => {
  sql.query(`SELECT r.recipe_id, r.recipe_name, r.user_id, Concat(u.first_name, ' ', u.last_name) AS contributor, r.photo_url, r.prep_time, r. cook_time, r. directions, i.ingredient_id, i.ingredient_name, i.quantity, (CASE WHEN EXISTS(SELECT 1 FROM favorites_to_users WHERE user_id = ${user_id} AND recipe_id = ${recipe_id})
                THEN true ELSE false
                END) AS is_favorite
                FROM recipes AS r           
                LEFT JOIN
                  ingredients AS i
                  ON i.recipe_id = r.recipe_id
                LEFT JOIN
                  users AS u
                  ON u.user_id = r.user_id
                WHERE r.recipe_id = ${recipe_id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    if (res.length) {
      // console.log('found recipe: ', res);
      result(null, res);
      return;
    }
    // Recipe ID not found
    result({ kind: 'not_found' }, null);
  });
};

Recipe.findByUserId = (user_id, result) => {
  sql.query(`SELECT * FROM recipes WHERE user_id = ${user_id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('recipes: ', res);
    result(null, res);
  });
};

Recipe.findRecentRecipes = result => {
  sql.query(`SELECT r.recipe_id, r.recipe_name, r.user_id, Concat(u.first_name, ' ', u.last_name) AS contributor, r.photo_url, r.prep_time, r.cook_time 
            FROM recipes AS r
            LEFT JOIN
              users as u
              ON r.user_id = u.user_id
            ORDER BY r.created_at DESC LIMIT 3`, (err, res) => {
              if (err) {
                console.log('error: ', err);
                result(null, err);
                return;
              }
    console.log('recipes: ', res);
    result(null, res);
  });
};

Recipe.updateById = (recipe_id, recipe, result) => {
  sql.query(
    'UPDATE recipes SET recipe_name = ?, photo_url = ?, prep_time = ?, cook_time = ?, direction = ? WHERE recipe_id = ?',
    [recipe.recipe_name, recipe.photo_url, recipe.prep_time, recipe.cook_time, recipe.directions, recipe_id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // Recipe ID not found
        result({ kind: 'not_found' }, null);
        return;
      }
      console.log('updated recipe: ', { recipe_id: recipe_id, ...recipe });
      result(null, { recipe_id: recipe_id, ...recipe });
    }
  );
};

Recipe.remove = (recipe_id, result) => {
  sql.query('DELETE FROM recipes WHERE recipe_id = ?', recipe_id, (err, res) => {
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

Recipe.findSearchResults = (search, result) => {
  sql.query(`SELECT r.recipe_id, r.recipe_name, r.user_id, Concat(u.first_name, ' ', u.last_name) AS contributor, r.photo_url, r.prep_time, r.cook_time
  FROM recipes AS r           
  LEFT JOIN
    users as u
    ON r.user_id = u.user_id
  WHERE r.recipe_name LIKE '%${search}%'`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    console.log('recipes: ', res);
    result(null, res);
  });
};

module.exports = Recipe;