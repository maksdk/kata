CREATE TABLE article_categories (
	name varchar(255),
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY
);

INSERT INTO article_categories (name) VALUES ('Maks'), ('Yo');