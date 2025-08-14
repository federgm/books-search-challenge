import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.withSchema("books-search-engine").hasTable("books");

  if (!exists) {
    await knex.schema.withSchema("books-search-engine").createTable("books", (table) => {
      table.increments("id").primary();
      table.string("searchKey", 255).notNullable();
      table.text("content");
    });
  }

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_books_searchkey
    ON "books-search-engine".books ("searchKey")
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema("books-search-engine").dropTableIfExists("books");
  await knex.raw(`DROP SCHEMA IF EXISTS "books-search-engine" CASCADE`);
}
