const sql = require('./db.js');

// constructor
const Recipe = function(recipe) {
  this.recipe_name = recipe.recipe_name;
  this.author = recipe.author;
  this.photo_url = recipe.photo_url;
  this.prep_time = recipe.prep_time;
  this.cook_time = recipe.cook_time;
  this.directions = recipe.directions;
  this.created_at = new Date();
};

Recipe.create = (newRecipe, result) => {
  sql.query('INSERT INTO recipes SET ?', newRecipe, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    console.log('created recipe: ', { id: res.insertId, ...newRecipe });
    result(null, { id: res.insertId, ...newRecipe });
  });
};

Recipe.findById = (recipe_id, result) => {
  sql.query(`SELECT r.recipe_name, r.author, r.photo_url, r.prep_time, r. cook_time, r. directions, i.ingredient_name, t.tag, i_to_r.quantity 
                FROM recipes AS r           
                LEFT JOIN 
                  ingredients_to_recipes AS i_to_r 
                  ON r.recipe_id = i_to_r.recipe_id
                LEFT JOIN
                  ingredients AS i
                  ON i.ingredient_id = i_to_r.ingredient_id
                LEFT JOIN
                  tags_to_recipes AS t_to_r
                  ON r.recipe_id = t_to_r.recipe_id
                LEFT JOIN
                  tags AS t
                  ON t.tag_id = t_to_r.tag_id 
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

Recipe.getAll = result => {
  sql.query('SELECT * FROM recipes', (err, res) => {
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
    'UPDATE recipes SET recipe_name = ?, contributor = ?, photo_url = ?, prep_time = ?, cook_time = ? WHERE recipe_id = ?',
    [recipe.recipe_name, recipe.contributor, recipe.photo_url, recipe.prep_time, recipe.cook_time, recipe_id],
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

module.exports = Recipe;