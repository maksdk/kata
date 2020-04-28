CREATE TABLE users (
	id bigint PRIMARY KEY,
	first_name varchar(255),
	created_at timestamp
);

INSERT INTO users (id, first_name, created_at) VALUES (1, 'Maks', '1988-02-08');

CREATE TABLE orders (
	id bigint PRIMARY KEY,
	user_first_name varchar(255),
	months integer,
	created_at timestamp
);

INSERT INTO orders (id, user_first_name, months, created_at) VALUES (1, 'Maks', 2, '2020-04-28');
INSERT INTo orders (id, user_first_name, months, created_at) VALUES (2, 'Maks', 2, '2020-06-28');