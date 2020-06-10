CREATE TABLE IF NOT EXISTS 'recipes' (
  recipe_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  recipe_name varchar(40) NOT NULL,
  contributor varchar(40),
  photo_url varchar(255),
  prep_time varchar(40),
  cook_time varchar(40),
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `recipes` (`recipe_name`, `contributor`, `prep_time`, `cook_time`, `created_at`) VALUES
('Pulled Pork', 'Tim Behnken', '30 minutes', '3 to 5 hours', '2020-06-08 17:10:00'),
('Pecan Tarts', 'Mil Behnken', '1 hour', '30 minutes', '2020-06-08 17:15:00');