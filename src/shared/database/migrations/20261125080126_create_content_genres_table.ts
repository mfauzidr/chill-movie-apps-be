
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("content_genres", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table.specificType("content_uuid", "CHAR(36)").notNullable();
    table.integer("genre_id").notNullable();

    table.unique(["content_uuid", "genre_id"], "uq_content_genres");

    table.index(["genre_id"], "idx_content_genres_genre_id");

    table
      .foreign("content_uuid", "content_genres_ibfk_1")
      .references("uuid")
      .inTable("contents");

    table
      .foreign("genre_id", "content_genres_ibfk_2")
      .references("id")
      .inTable("genres");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("content_genres");
}
