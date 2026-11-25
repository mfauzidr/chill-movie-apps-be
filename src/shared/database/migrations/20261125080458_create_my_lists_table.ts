
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("my_lists", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table.specificType("content_uuid", "CHAR(36)").notNullable();
    table.specificType("user_uuid", "CHAR(36)").notNullable();

    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

    table.unique(
      ["user_uuid", "content_uuid"],
      "uq_my_lists_user_content"
    );

    table.index(["content_uuid"], "idx_my_lists_content_uuid");

    table
      .foreign("content_uuid", "my_lists_ibfk_1")
      .references("uuid")
      .inTable("contents");

    table
      .foreign("user_uuid", "my_lists_ibfk_2")
      .references("uuid")
      .inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("my_lists");
}
