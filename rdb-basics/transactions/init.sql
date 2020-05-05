DROP TABLE IF EXISTS friendship;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id bigint PRIMARY KEY,
  first_name varchar(255),
  email varchar(255),
  birthday timestamp
);

CREATE TABLE friendship (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user1_id bigint REFERENCES users(id),
  user2_id bigint REFERENCES users(id)
);

INSERT INTO users (id, first_name, email, birthday) VALUES
  (1, 'Sansa', 'sansa@winter.com', '1999-10-23'),
  (2, 'Jon', 'jon@winter.com', '1999-10-07'),
  (3, 'Daenerys', 'daenerys@drakaris.com', '1999-10-23'),
  (4, 'Arya', 'arya@winter.com', '2003-03-29'),
  (5, 'Robb', 'robb@winter.com', '1999-11-23'),
  (6, 'Brienne', 'brienne@tarth.com', '2001-04-04'),
  (7, 'Tirion', 'tirion@got.com', '1975-1-11');
