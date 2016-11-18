DROP DATABASE IF EXISTS generator;
CREATE DATABASE generator;

\c generator;

CREATE TABLE posts (
  ID SERIAL PRIMARY KEY,
  title VARCHAR,
  author VARCHAR,
  message VARCHAR
);

INSERT INTO posts (title, author, message)
  VALUES ('My first post', 'mckade', 'This is my first post that is seeded into the database.');
