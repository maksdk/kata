ALTER TABLE users RENAME COLUMN name to first_name;
ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ADD UNIQUE (email);
ALTER TABLE users ADD COLUMN created_at timestamp;
ALTER TABLE users DROP COLUMN age;