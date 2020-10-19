const recipes = require('../controllers/recipeController.js');
const multer = require('multer');
const upload = multer({dest: process.env.PHOTO_PATH});

module.exports = app => {
    // Create a new recipe
    app.post('/api/v1/recipes', upload.single('imageFile'), recipes.create);

    // Return all recipes
    app.get('/api/v1/recipes', recipes.findAll);

    // Return a single Recipe with recipeId
    app.get('/api/v1/recipes/:recipeId', recipes.findOne);

    // Return all recipes with userId
    app.get('/api/v1/recipes-by-author/:userId', recipes.findByUserId);

    // Update a recipe with recipeId
    app.put('/api/v1/recipes/:recipeId', recipes.update);

    // Delete a recipe with recipeId
    app.delete('/api/v1/recipes/:recipeId', recipes.delete);

    // Return recently added recipes
    app.get('/api/v1/recent-recipes', recipes.findRecentRecipes);

    // Return a single Recipe with recipeId
    app.get('/api/v1/recipes/photos/:recipeId', recipes.findPhoto);
};