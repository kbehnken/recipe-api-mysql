const sql = require('./db.js');

// constructor
const Recipe = function(recipe) {
  this.recipe_name = recipe.recipe_name;
  this.contributor = recipe.contributor;
  this.photo_url = recipe.photo_url;
  this.prep_time = recipe.prep_time;
  this.cook_time = recipe.cook_time;
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
  sql.query(`SELECT * FROM recipes WHERE recipe_id = ${recipe_id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found recipe: ', res[0]);
      result(null, res[0]);
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