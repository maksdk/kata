CREATE TABLE orders (
	id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	user_id bigint REFERENCES users(id),
	created_at timestamp
);

CREATE TABLE goods (
	id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name varchar(255),
	price integer 
);

CREATE TABLE order_items (
	id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	order_id bigint REFERENCES orders(id),
	good_id bigint REFERENCES goods(id),
	price integer
);