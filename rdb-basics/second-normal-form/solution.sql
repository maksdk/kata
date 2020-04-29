CREATE TABLE brands (
	id integer PRIMARY KEY,
	discount integer,
	name varchar(255)
);

CREATE TABLE cars (
	id integer PRIMARY KEY,
	model varchar(255),
	brand_id integer REFERENCES brands(id),
	price integer
);

INSERT INTO brands VALUES (1, 5, 'bmw'), (2, 10, 'nissan');


INSERT INTO cars VALUES
  (1, 'm5', 1, 5500000),
  (2, 'x5m', 1, 6000000),
  (3, 'm1', 1, 2500000),
  (4, 'almera', 2, 5500000),
  (5, 'gt-r', 2, 5000000);

