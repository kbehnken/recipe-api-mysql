const recipes = require('../controllers/recipeController.js');

module.exports = app => {
    // Create a new recipe
    app.post('/api/v1/recipes', recipes.create);

    // Return all recipes
    app.get('/api/v1/recipes', recipes.findAll);

    // Return a single Recipe with recipeId
    app.get('/api/v1/recipes/:recipeId', recipes.findOne);

    // Update a Recipe with recipeId
    app.put('/api/v1/recipes/:recipeId', recipes.update);

    // Delete a Recipe with recipeId
    app.delete('/api/v1/recipes/:recipeId', recipes.delete);

};