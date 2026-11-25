
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("content_casts", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table.specificType("content_uuid", "CHAR(36)").notNullable();
    table.integer("cast_id").notNullable();

    table.unique(["content_uuid", "cast_id"], "uq_content_casts");

    table.index(["cast_id"], "idx_content_casts_cast_id");

    table
      .foreign("content_uuid", "content_casts_ibfk_1")
      .references("uuid")
      .inTable("contents");

    table
      .foreign("cast_id", "content_casts_ibfk_2")
      .references("id")
      .inTable("casts");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("content_casts");
}
