module.exports = app => {
    const ingredients = require("../controllers/ingredientController.js");

    // Create a new ingredient
    app.post("/api/v1/ingredients", ingredients.create);

    // Returns a list of all ingredients
    app.get("/api/v1/ingredients", ingredients.findAll);

    // Return a single ingredient with ingredientId
    app.get("/api/v1/ingredients/:ingredientId", ingredients.findOne);

    // Update a ingredient with ingredientId
    app.put("/api/v1/ingredients/:ingredientId", ingredients.update);

    // Delete a ingredient with ingredientId
    app.delete("/api/v1/ingredients/:ingredientId", ingredients.delete);

};