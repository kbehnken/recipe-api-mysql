CREATE TABLE IF NOT EXISTS recipes (
  recipe_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  recipe_name varchar(40) NOT NULL,
  author varchar(40),
  photo_url varchar(255),
  prep_time varchar(40),
  cook_time varchar(40),
  directions text,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS ingredients (
  ingredient_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  ingredient_name varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS ingredients_to_recipes (
  recipe_id int(11) NOT NULL,
  ingredient_id int(11) NOT NULL,
  quantity text NOT NULL,
  PRIMARY KEY (recipe_id, ingredient_id),
  FOREIGN KEY (recipe_id)
    REFERENCES recipes(recipe_id),
  FOREIGN KEY (ingredient_id)
    REFERENCES ingredients(ingredient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS tags (
  tag_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  tag varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS tags_to_recipes (
  recipe_id int(11) NOT NULL,
  tag_id int(11) NOT NULL,
  PRIMARY KEY (recipe_id, tag_id),
  FOREIGN KEY (recipe_id)
    REFERENCES recipes(recipe_id),
  FOREIGN KEY (tag_id)
    REFERENCES tags(tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS users (
  user_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name varchar(40) NOT NULL,
  last_name varchar(40) NOT NULL,
  email varchar(70) NOT NULL,
  password text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `recipes` (`recipe_name`, `contributor`, `prep_time`, `cook_time`, `created_at`) VALUES
('Pulled Pork', 'Tim Behnken', '30 minutes', '3 to 5 hours', '2020-06-08 17:10:00'),
('Pecan Tarts', 'Mil Behnken', '1 hour', '30 minutes', '2020-06-08 17:15:00');

INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`, `is_admin`, `created_at`) VALUES
('Maddy', 'Behnken', 'maddy@gmail.com', '1234', 'TRUE', '2020-08-25 17:10:00');

INSERT INTO `ingredients` (`ingredient_name`) VALUES
('ground beef'),
('onion'),
('pecans'),
('white sugar'),
('light brown sugar'),
('egg'),
('milk'),
('salt'),
('all-purpose white flour'),
('carrot');

INSERT INTO `tags` (`tag`) VALUES
('Breakfast'),
('Lunch'),
('Dinner'),
('Appetizer'),
('Entree'),
('Side Dish'),
('Dessert'),
('Beverage'),
('No Carb'),
('Mexican'),
('Chinese'),
('Italian'),
('French'),
('Halloween'),
('Thanksgiving'),
('Christmas');

-- INSERT INTO `ingredients_to_recipes` (`recipe_id`, `ingredient_id`, `quantity`) VALUES
-- (2, 3, '2 cups'),
-- (7, 1, '2 pounds'),
-- (7, 6, '1'),
-- (2, 5, '3 cups'),
-- (2, 6, '2'),
-- (7, 10, '1 cup'),
-- (1, 8, '1/4 teaspoon'),
-- (7, 2, '1 cup'),
-- (7, 5, '1/4 cup');

-- INSERT INTO `tags_to_recipes` (`recipe_id`, `tag_id`) VALUES
-- (1, 3),
-- (10, 5),
-- (10, 3),
-- (1, 5),
-- (2, 7),
-- (2, 15);