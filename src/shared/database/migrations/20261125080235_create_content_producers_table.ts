
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("content_producers", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table.specificType("content_uuid", "CHAR(36)").notNullable();
    table.integer("producer_id").notNullable();

    table.unique(
      ["content_uuid", "producer_id"],
      "uq_content_producers"
    );

    table.index(
      ["producer_id"],
      "idx_content_producers_producer_id"
    );

    table
      .foreign("content_uuid", "content_producers_ibfk_1")
      .references("uuid")
      .inTable("contents");

    table
      .foreign("producer_id", "content_producers_ibfk_2")
      .references("id")
      .inTable("producers");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("content_producers");
}
