
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("seasons", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table.specificType("content_uuid", "CHAR(36)").notNullable();
    table.string("name", 100).notNullable();

    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

    table.timestamp("updated_at").nullable().defaultTo(null);

    table.unique(
      ["content_uuid", "name"],
      "uq_seasons_content_name"
    );

    table
      .foreign("content_uuid", "seasons_ibfk_1")
      .references("uuid")
      .inTable("contents");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("seasons");
}