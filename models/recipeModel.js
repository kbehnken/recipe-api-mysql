const sql = require('./db.js');

// Recipe constructor
const Recipe = function(recipe) {
  this.recipe_id = recipe.recipe_id;
  this.user_id = recipe.user_id;
  this.recipe_name = recipe.recipe_name;
  this.prep_time = recipe.prep_time;
  this.cook_time = recipe.cook_time;
  this.ingredients = recipe.ingredients;
  this.directions = recipe.directions;
};

Recipe.create = (newRecipe) => {
  const statement = sql.format(`INSERT INTO recipes (user_id, recipe_name, prep_time, cook_time, directions, created_at) VALUES ('${newRecipe.user_id}', '${newRecipe.recipe_name}', '${newRecipe.prep_time}', '${newRecipe.cook_time}', '${newRecipe.directions}', Now())`);

  return sql.promise().beginTransaction()
  .then(() => {
    return sql.promise().query(statement);
  })
  .then((result) => {
    if (newRecipe.ingredients.length){
      const mappedIngredients = newRecipe.ingredients.map(item => [item.quantity, item.ingredient_name, result[0].insertId]);

      return sql.promise().query('INSERT INTO ingredients (quantity, ingredient_name, recipe_id) VALUES ?', [mappedIngredients]);
    }
    return result[0].insertId;
  })
  .then(async recipe_id => {
    await sql.promise().commit()
    return recipe_id;
  })
  .catch(async err => {
    await sql.promise().rollback();
    throw err
  })
};

Recipe.setIngredients = async (ingredients, recipe_id) => {
  const mappedIngredients = ingredients.map(item => [item.quantity, item.ingredient_name, recipe_id]);

  sql.promise().beginTransaction()
  .then(async () => {
    return await sql.promise().query(`DELETE FROM ingredients WHERE recipe_id = ${recipe_id}`)
  })
  .then(() => {
    if (mappedIngredients.length) {
      return sql.promise().query('INSERT INTO ingredients (quantity, ingredient_name, recipe_id) VALUES ?', [mappedIngredients]);
    }
  })
  .then(() => {
    return sql.promise().commit();
  })
  .catch(async err => {
    await sql.promise().rollback();
    throw err
  })
};

Recipe.findAll = result => {
  sql.query(`SELECT r.recipe_id, r.recipe_name, r.user_id, Concat(u.first_name, ' ', u.last_name) AS contributor, r.prep_time, r.cook_time
  FROM recipes AS r           
  LEFT JOIN
    users as u
    ON r.user_id = u.user_id`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Recipe.findByRecipeId = (recipe_id, user_id, result) => {
  sql.query(`SELECT r.recipe_id, r.recipe_name, r.user_id, Concat(u.first_name, ' ', u.last_name) AS contributor, r.prep_time, r. cook_time, r. directions, i.ingredient_id, i.ingredient_name, i.quantity, (CASE WHEN EXISTS(SELECT 1 FROM favorites_to_users WHERE user_id = ${user_id} AND recipe_id = ${recipe_id})
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
    result(null, res);
  });
};

Recipe.findRecentRecipes = result => {
  sql.query(`SELECT r.recipe_id, r.recipe_name, r.user_id, Concat(u.first_name, ' ', u.last_name) AS contributor, r.prep_time, r.cook_time 
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
    result(null, res);
  });
};

Recipe.updateById = (recipe, recipe_id, result) => {
  return sql.promise().query(
    'UPDATE recipes SET recipe_name = ?, prep_time = ?, cook_time = ?, directions = ? WHERE recipe_id = ?',
    [recipe.recipe_name, recipe.prep_time, recipe.cook_time, recipe.directions, recipe_id])
  .then(() => {
    console.log('updated recipe: ', recipe_id );
  })
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
  sql.query(`SELECT r.recipe_id, r.recipe_name, r.user_id, Concat(u.first_name, ' ', u.last_name) AS contributor, r.prep_time, r.cook_time
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
    result(null, res);
  });
};

module.exports = Recipe;