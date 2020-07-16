const Recipe = require('../models/recipeModel.js');

// Create and save a new recipe
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: 'Content cannot be empty.'
    });
  }

  // Create a recipe
  const recipe = new Recipe({
    recipe_name: req.body.recipe_name,
    contributor: req.body.contributor,
    photo_url: req.body.photo_url,
    prep_time: req.body.prep_time,
    cook_time: req.body.cook_time
  });

  // Save recipe in the database
  Recipe.create(recipe, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'An error occurred while attempting to create this recipe.'
      });
    else res.send(data);
  });
};

// Retrieve all recipes from the database
exports.findAll = (req, res) => {
  Recipe.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'An error occurred while attempting to retrieve recipes.'
      });
    else res.send(data);
  });
};

// Find a single recipe with a recipeId
exports.findOne = (req, res) => {
  Recipe.findById(req.params.recipeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Recipe with id ${req.params.recipeId} not found.`
        });
      } else {
        res.status(500).send({
          message: `An error occurred while attempting to retrieve recipe with id ${req.params.recipeId}.`
        });
      }
    } else res.send(data);
  });
};

// Update a recipe identified by the recipeId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: 'Content cannot be empty!'
    });
  }

  Recipe.updateById(
    req.params.recipeId,
    new Recipe(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).send({
            message: `Recipe with id ${req.params.recipeId} not found.`
          });
        } else {
          res.status(500).send({
            message: `An error occurred while attempting to update recipe with id ${req.params.recipeId}.`
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a recipe with the specified recipeId in the request
exports.delete = (req, res) => {
  Recipe.remove(req.params.recipeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ 
          message: `Recipe with id ${req.params.recipeId} not found.`
        });
      } else {
        res.status(500).send({ 
          message: `Cannot delete recipe with id ${req.params.recipeId}.`
        });
      }
    } else {
      res.send({ 
        message: `Recipe was successfully deleted!`
      });
    }
  });
};