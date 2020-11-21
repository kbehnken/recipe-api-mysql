const Ingredient = require("../models/ingredientModel.js");

// Create and save a new ingredient
exports.create = (req, res) => {
  const recipe_id = req.params.recipeId
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create an ingredient
  const ingredient = new Ingredient({
    ingredient_name: req.body.ingredient_name,
    quantity: req.body.quantity,
    recipe_id: recipe_id
  });

  // Save ingredient in the database
  Ingredient.create(ingredient, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "An error occurred while creating the ingredient."
      });
    else res.send(data);
  });
};

// Retrieve all ingredients from the database.
exports.findAll = (req, res) => {
  
};

// Find a single ingredient with a ingredientId
exports.findOne = (req, res) => {
  
};

// Update an ingredient identified by the ingredientId in the request
exports.update = (req, res) => {
  
};

// Delete an ingredient with the specified ingredientId in the request
exports.deleteIngredient = (req, res) => {
    const ingredient_id = req.params.ingredientId;
    Ingredient.removeIngredient(ingredient_id, (err) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).send({ 
            message: `Ingredient with id ${ingredient_id} not found.`
          });
        } else {
          res.status(500).send({ 
            message: `Cannot delete ingredient with id ${ingredient_id}.`
          });
        }
      } else {
        res.status(200).send({ 
          message: `Ingredient was successfully deleted.`
        });
      }
    });
};