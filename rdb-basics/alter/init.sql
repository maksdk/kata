DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email varchar(255) NOT NULL,
  age integer,
  name varchar(255)
);

INSERT INTO users (email, age, name) VALUES ('noc@mail.com', 44, 'mike');
