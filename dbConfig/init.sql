SET foreign_key_checks = 0;

CREATE TABLE IF NOT EXISTS recipes (
  recipe_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id int(11) NOT NULL,
  FOREIGN KEY (user_id)
    REFERENCES users(user_id),
  recipe_name varchar(40) NOT NULL,
  prep_time varchar(40),
  cook_time varchar(40),
  directions text,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS ingredients (
  ingredient_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  recipe_id int(11) NOT NULL,
  FOREIGN KEY (recipe_id)
    REFERENCES recipes(recipe_id),
  ingredient_name varchar(40) NOT NULL,
  quantity text NOT NULL
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

CREATE TABLE IF NOT EXISTS favorites_to_users (
  recipe_id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  PRIMARY KEY (recipe_id, user_id),
  FOREIGN KEY (recipe_id)
    REFERENCES recipes(recipe_id),
  FOREIGN KEY (user_id)
    REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`, `is_admin`, `created_at`) VALUES
('Maddy', 'Behnken', 'maddy@gmail.com', '$2b$10$Vx7.2unSp//cfE7k/3sWBu9QTvVGB7DiVbyFOJR0qs61bDw0qVvau', 'TRUE', '2020-08-25 17:10:00'),
('Xander', 'Behnken', 'xander@gmail.com', '$2b$10$Vx7.2unSp//cfE7k/3sWBu9QTvVGB7DiVbyFOJR0qs61bDw0qVvau', 'TRUE', '2020-08-25 17:10:00'),
('Cleo', 'Behnken', 'cleo@gmail.com', '$2b$10$Vx7.2unSp//cfE7k/3sWBu9QTvVGB7DiVbyFOJR0qs61bDw0qVvau', 'TRUE', '2020-08-25 17:10:00');

INSERT INTO `recipes` (`user_id`,`recipe_name`, `prep_time`, `cook_time`, `created_at`) VALUES
(2, 'Pulled Pork', '30 minutes', '3 to 5 hours', '2020-06-08 17:10:00'),
(1, 'Pecan Tarts', '1 hour', '30 minutes', '2020-06-08 17:15:00'),
(3, 'Meatloaf', '1 hour', '30 minutes', '2020-06-08 17:15:00');

INSERT INTO `ingredients` (`recipe_id`, `ingredient_name`, `quantity`) VALUES
(3, 'ground beef', '2 lbs'),
(3, 'onion', '1'),
(2, 'pecans', '2 cups'),
(2, 'white sugar', '1 cup'),
(2, 'light brown sugar', '1 cup'),
(2, 'egg', '2 large'),
(4, 'milk', '1 1/2 cups'),
(2, 'salt', '1/2 teaspoon'),
(2, 'all-purpose white flour', '1 cup'),
(3, 'carrot', '1 medium');

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

INSERT INTO `tags_to_recipes` (`recipe_id`, `tag_id`) VALUES
(1, 3),
(1, 5),
(3, 3),
(3, 5),
(2, 7),
(2, 15);

SET foreign_key_checks = 1;