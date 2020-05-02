CREATE TABLE users (
	id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL UNIQUE,
	created_at timestamp NOT NULL
);

CREATE TABLE topics (
	id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	user_id bigint REFERENCES users(id) NOT NULL,
	body text NOT NULL,
	created_at timestamp NOT NULL
);