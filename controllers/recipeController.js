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
      if (err){
          res.status(500).send({
            message:
              err.message || 'An error occurred while attempting to create this recipe.'
          });
      } else {
          res.send(data);
      }
    });
};

// Return all recipes from the database
exports.findAll = (req, res) => {
    console.log(req.user);
    Recipe.getAll((err, data) => {
        if (err)
            res.status(500).send({
              message:
                err.message || 'An error occurred while attempting to retrieve all recipes.'
            });
        else res.send(data);
    });
};

// Return a single recipe with a recipeId
exports.findOne = (req, res) => {
  let uniqueIngredients, uniqueTags;
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
        } else {
          let ingredients = data.map(item => {
            return item.ingredient_name;
          });
          uniqueIngredients = Array.from(new Set(ingredients));
          let tags = data.map(item => {
            return item.tag;
          });
          uniqueTags = Array.from(new Set(tags));
        };
        console.log(data);
        res.send({
          recipe_name: data[0].recipe_name,
          author: data[0].author,
          photo_url: data[0].photo_url,
          prep_time: data[0].prep_time,
          cook_time: data[0].cook_time,
          ingredients: uniqueIngredients,
          directions: data[0].directions,
          tags: uniqueTags
        });
    });
};

// Update a recipe with the recipeId specified in the request
exports.update = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: 'Content cannot be empty!'
        });
    }
    Recipe.updateById(req.params.recipeId, new Recipe(req.body), (err, data) => {
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
    });
};

// Delete a recipe with the recipeId specified in the request
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