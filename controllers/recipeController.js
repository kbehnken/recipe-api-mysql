const Recipe = require('../models/recipeModel.js');
const fs = require('fs');
const path = require('path');
const fileType = require('file-type');
const isAllowedFileType = require('../helpers/isAllowedFileType.js');
const handleFileUpload = require('../helpers/handleFileUpload');

// Create and save a new recipe
exports.create = async (req, res) => {
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
      prep_time: req.body.prep_time,
      cook_time: req.body.cook_time,
      ingredients: req.body.ingredients,
      directions: req.body.directions
  });
  recipe.ingredients = JSON.parse(req.body.ingredients)
  if (req.file && await isAllowedFileType(req.file.buffer) !== true) {
    return res.status(415).send();
  }
  // Save recipe in the database
  return Recipe.create(recipe)
  .then((recipe_id) => {
    console.log('Created recipe: ' + recipe_id);
    if (req.file) {
      handleFileUpload(req.file.buffer, recipe_id);
    }
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
  let ingredients, uniqueTags;
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
          ingredients = data.map(item => {
            if (item.ingredient_id) { 
              return {
                ingredient_id: item.ingredient_id,
                ingredient_name: item.ingredient_name,
                quantity: item.quantity
              };
            }
          }).filter(Boolean);
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
          prep_time: data[0].prep_time,
          cook_time: data[0].cook_time,
          ingredients: ingredients,
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
exports.findPhoto = async (req, res) => {
  const recipe_id = req.params.recipeId;
  const fileName = path.join(__dirname, '../', process.env.PHOTO_PATH + '/' + 'recipe-photo-'+recipe_id);
  if (fs.existsSync(fileName)){
    const type = await fileType.fromFile(fileName);
    let contentType = '';
    switch(type.ext) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
    }
    const options = {
      headers: {
        'Content-Type': contentType
      }
    }
    res.sendFile(fileName, options);
  } else {
    res.status(404).send();
  }
};

// Update a recipe with the recipeId specified in the request
exports.update = async (req, res) => {
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
    directions: req.body.directions
  });
  recipe.ingredients = JSON.parse(req.body.ingredients)
  if (req.file && await isAllowedFileType(req.file.buffer) !== true) {
    return res.status(415).send();
  }
  Recipe.updateById(recipe, req.params.recipeId)
  .then(() => {
    return Recipe.setIngredients(recipe.ingredients, req.params.recipeId)
  })
  .then(() => {
    if (req.file) {
      handleFileUpload(req.file.buffer, req.params.recipeId);
    }
    res.status(200).send()
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