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
      // photo_url: req.file.filename || '',
      prep_time: req.body.prep_time,
      cook_time: req.body.cook_time,
      ingredients: req.body.ingredients,
      directions: req.body.directions
  });
  recipe.ingredients = JSON.parse(req.body.ingredients)
  if (req.file) {
    recipe.photo_url = req.file.filename;
  } else {
    recipe.photo_url = null;
  }
  // Save recipe in the database
  return Recipe.create(recipe)
  .then((results) => {
    console.log('Created recipe: ' + results[0].insertId);
    res.status(200).send('Success');
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('An error occurred while attempting to create this recipe.')
  })
};

// Return all recipes
exports.findAll = (req, res) => {
  Recipe.findAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || 'An error occurred while attempting to retrieve all recipes.'
      });
    }
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

// Return a recipe image
// TODO Detect file type
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
      if (fileName) {
        res.sendFile(fileName, options);
      } else {
        res.status(200).send();
      }
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
  const recipe = new Recipe({
    recipe_id: req.params.recipeId,
    user_id: req.user.user_id,
    recipe_name: req.body.recipe_name,
    prep_time: req.body.prep_time,
    cook_time: req.body.cook_time,
    // ingredients: req.body.ingredients,
    directions: req.body.directions
  });
  recipe.ingredients = JSON.parse(req.body.ingredients)
  if (req.file) {
    recipe.photo_url = req.file.filename;
  } else {
    recipe.photo_url = null;
  }
  Recipe.updateById(recipe, req.params.recipeId)
  .then(() => {
    return Recipe.setIngredients(recipe.ingredients, req.params.recipeId)
  })
  .then(() => {
    res.status(200).send('Success.')
  })
  .catch(err => {
    console.log(err);
    res.status(500).send({
      message:
        err.message || 'An error occurred while attempting to update this recipe.'
    });
  })
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

// Return search results
exports.findSearchResults = (req, res) => {
  Recipe.findSearchResults(req.body.search, (err, data) => {
      if (err)
          res.status(500).send({
            message:
              err.message || 'An error occurred while attempting to search all recipes.'
          });
      else res.status(200).send(data);
  });
};