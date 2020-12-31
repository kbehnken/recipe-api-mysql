# Recipe Box - API Server

## Description

- This server application is the back-end for https://github.com/kbehnken/recipe-api.

## Prerequisites

- MySQL database
- User credentials with full access to the database

## Installation

1. Clone this repository with: `git clone https://github.com/kbehnken/recipe-api`.
2. Initialize the database:
```
cat dbConfig/init.sql | mysql -u username -p your_database
```
3. Create a .env file on the root of the project directory:
```
HOST=localhost
SERVER_PORT = 4042

DB=recipe_box
DB_USERNAME=your_username
DB_PASSWORD=your_password

ACCESS_TOKEN_SECRET=mysecretstring

PHOTO_PATH=./public/images
```
4. Type `npm i` in the root of the project directory.
5. To start the server, type `node index.js`.

## API Routes

- Generate a new access token: POST `/api/v1/login`
- Create a new recipe: POST `/api/v1/recipes`
- Return all recipes: GET `/api/v1/recipes`
- Return a single recipe with recipeId: GET `/api/v1/recipes/:recipeId`
- Update a recipe with recipeId: PUT `/api/v1/recipes/:recipeId` {body: recipe_name, prep_time, cook_time}
- Delete a recipe with recipeId: DELETE `/api/v1/recipes/:recipeId`

### Example Usage
```shell
curl -i -H 'content-type: application/json' -X POST -d '{"email": "user@example.com", "password": "1234"}' http://localhost:4042/api/v1/login
```

### Example Response

```json
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNsZW9AZ21haWwuY29tIiwidXNlcl9pZCI6MywiZmlyc3RfbmFtZSI6IkNsZW9wYXRyYSIsImxhc3RfbmFtZSI6IkJlaG5rZW4iLCJpc19hZG1pbiI6MCwiaWF0IjoxNjA5MzczMjg4LCJleHAiOjE2MDk2MzI0ODh9.bKyru7UygB7RhKrDz3_NXY_OlOH5ugkUwumItDEoEuE"}
```