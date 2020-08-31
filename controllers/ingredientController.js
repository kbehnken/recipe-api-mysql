const Ingredient = require("../models/ingredientModel.js");

// Create and save a new ingredient
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create an ingredient
  const ingredient = new Ingredient({
    name: req.body.ingredient_name,
    active: req.body.active
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
exports.delete = (req, res) => {
  
};