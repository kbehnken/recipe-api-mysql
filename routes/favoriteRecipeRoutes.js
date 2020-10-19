const recipes = require('../controllers/favoriteRecipeController.js');

module.exports = app => {
    // Add a new favorite recipe
    app.post('/api/v1/recipes/favorites', recipes.createFavoriteRecipe);

    // Return all favorite recipes with userId
    app.get('/api/v1/recipes/favorites/:userId', recipes.findFavoritesByUserId);

    // Delete a favorite recipe with recipeId
    app.delete('/api/v1/recipes/favorites/:recipeId', recipes.deleteFavoriteRecipe);
};