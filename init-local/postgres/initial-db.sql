CREATE SCHEMA IF NOT EXISTS "books-search-engine";

CREATE TABLE IF NOT EXISTS "books-search-engine".books (
    id SERIAL PRIMARY KEY,
    searchKey VARCHAR(255) NOT NULL,
    content TEXT
);

CREATE INDEX IF NOT EXISTS idx_books_searchkey
    ON "books-search-engine".books (searchKey);
