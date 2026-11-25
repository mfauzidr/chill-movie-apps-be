
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("movies", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table.specificType("content_uuid", "CHAR(36)").notNullable();
    table.integer("duration").notNullable();

    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

    table.timestamp("updated_at").nullable().defaultTo(null);

    table.unique(["content_uuid"], "content_uuid");

    table
      .foreign("content_uuid", "movies_ibfk_1")
      .references("uuid")
      .inTable("contents");

    table.check("duration > 0", [], "chk_movies_duration");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("movies");
}
