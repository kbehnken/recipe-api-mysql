const sql = require('./db.js');

// constructor
const Ingredient = function(ingredient) {
  this.ingredient_name = ingredient.ingredient_name;
  this.quantity = ingredient.quantity;
  this.recipe_id = ingredient.recipe_id;
};

Ingredient.create = (newIngredient, result) => {
  sql.query('INSERT INTO ingredients SET ?', newIngredient, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    console.log('created ingredient: ', { id: res.insertId, ...newIngredient });
    result(null, { id: res.insertId, ...newIngredient });
  });
};

Ingredient.findById = (ingredientId, result) => {
  sql.query(`SELECT * FROM ingredients WHERE ingredient_id = ${ingredientId}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found ingredient: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Ingredient ID not found
    result({ kind: 'not_found' }, null);
  });
};

Ingredient.getAll = result => {
  sql.query('SELECT * FROM ingredients', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('ingredients: ', res);
    result(null, res);
  });
};

Ingredient.updateById = (ingredient_id, ingredient, result) => {
  sql.query(
    'UPDATE ingredients SET ingredient_name = ?, quantity = ? WHERE ingredient_id = ?',
    [ingredient.ingredient_name, ingredient.quantity, ingredient_id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // Ingredient ID not found
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('updated ingredient: ', { id: id, ...ingredient });
      result(null, { id: id, ...ingredient });
    }
  );
};

Ingredient.removeIngredient = (ingredient_id, result) => {
  sql.query('DELETE FROM ingredients WHERE ingredient_id = ?', ingredient_id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // Ingredient ID not found
      result({ kind: 'not_found' }, null);
      return;
    }

    console.log('deleted ingredient with id: ', ingredient_id);
    result(null, res);
  });
};

module.exports = Ingredient;