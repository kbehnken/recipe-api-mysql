const Favorite = require('../models/favoriteRecipeModel.js');

// Create and save a new recipe
exports.createFavoriteRecipe = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
          message: 'Content cannot be empty.'
      });
    }
    // Create a favorite recipe
    const favoriteRecipe = new Favorite({
        recipe_id: req.body.recipe_id,
        user_id: req.body.user_id
    });
    // Save favorite recipe in the database
    Favorite.createFavoriteRecipe(favoriteRecipe, (err, data) => {
      if (err){
          res.status(500).send({
            message:
              err.message || 'An error occurred while attempting to create this favorite recipe.'
          });
      } else {
          res.send(data);
      }
    });
};

// Return all favorite recipes with userId
exports.findFavoritesByUserId = (req, res) => {
    Favorite.findFavoritesByUserId(req.params.userId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: `An error occurred while attempting to retrieve favorite recipe with user id ${req.params.userId}.`
            });
        } 
        console.log(data);
        res.status(200).send(data);
    });
};

// Delete a favorite recipe with the recipeId specified in the request
exports.deleteFavoriteRecipe = (req, res) => {
  try {
    Favorite.removeFavoriteRecipe(req.params.recipeId, req.user.user_id, (err) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).send({ 
            message: `Favorite recipe with id ${req.params.recipeId} not found.`
          });
        } else {
          res.status(500).send({ 
            message: `Cannot delete favorite recipe with id ${req.params.recipeId}.`
          });
        }
      } else {
        res.status(200).send({ 
          message: `Recipe was successfully deleted from favorites!`
        });
      }
    });
  } catch(err) {
    console.log(err);
  }
};