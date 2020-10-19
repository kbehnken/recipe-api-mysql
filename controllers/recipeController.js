const Recipe = require('../models/recipeModel.js');
const path = require('path');

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
        user_id: req.user.user_id,
        recipe_name: req.body.recipe_name,
        photo_url: req.file.filename,
        prep_time: req.body.prep_time,
        cook_time: req.body.cook_time,
        ingredients: req.body.ingredients,
        directions: req.body.directions
    });
    // Save recipe in the database
    Recipe.create(recipe, (err, data) => {
      if (err){
          res.status(500).send({
            message:
              err.message || 'An error occurred while attempting to create this recipe.'
          });
      } else {
        Recipe.setIngredients(data, (err, res) => {
          if (err){
            res.status(500).send({
              message:
                err.message || 'An error occurred while attempting to create this recipe.'
            });
          }
        })
        res.send(data);
      }
    });
};

// Return all recipes
exports.findAll = (req, res) => {
    Recipe.findAll((err, data) => {
        if (err)
            res.status(500).send({
              message:
                err.message || 'An error occurred while attempting to retrieve all recipes.'
            });
        else res.status(200).send(data);
    });
};

// Return a single recipe with recipeId
exports.findOne = (req, res) => {
  let uniqueIngredients, uniqueTags;
    Recipe.findByRecipeId(req.params.recipeId, req.user.user_id, (err, data) => {
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
            return {
              ingredient_id: item.ingredient_id,
              ingredient_name: item.ingredient_name,
              quantity: item.quantity
            }
          });
          uniqueIngredients = Array.from(new Set(ingredients));
          let tags = data.map(item => {
            return item.tag;
          });
          uniqueTags = Array.from(new Set(tags));
        };
        res.status(200).send({
          recipe_id: data[0].recipe_id,
          user_id: data[0].user_id,
          recipe_name: data[0].recipe_name,
          contributor: data[0].contributor,
          photo_url: data[0].photo_url,
          prep_time: data[0].prep_time,
          cook_time: data[0].cook_time,
          ingredients: uniqueIngredients,
          directions: data[0].directions,
          tags: uniqueTags,
          is_favorite: data[0].is_favorite
        });
    });
};

// Return all recipes with userId
exports.findByUserId = (req, res) => {
  let uniqueIngredients, uniqueTags;
    Recipe.findByUserId(req.params.userId, (err, data) => {
        if (err) {
          if (err.kind === 'not_found') {
              res.status(404).send({
                  message: `Recipe with user id ${req.params.userId} not found.`
              });
          } else {
              res.status(500).send({
                  message: `An error occurred while attempting to retrieve recipe with user id ${req.params.userId}.`
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
        res.status(200).send(data);
    });
};

// Return recently added recipes
exports.findRecentRecipes = (req, res) => {
  Recipe.findRecentRecipes((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'An error occurred while attempting to retrieve recent recipes.'
      });
    else res.status(200).send(data);
  });
};

//Return recipe image
exports.findPhoto = (req, res) => {
  const user_id = req.user.user_id;
  const recipe_id = req.params.recipeId;
  Recipe.findByRecipeId(recipe_id, user_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'An error occurred while attempting to retrieve recipe photo.'
      });
    else {
      const photoPath = path.join(process.env.PHOTO_PATH);
      const fileName = data[0].photo_url;
      const options = {
        root: photoPath,
        headers: {
          'content-type': 'image/jpeg'
        }
      }
      res.sendFile(fileName, options);
    };
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