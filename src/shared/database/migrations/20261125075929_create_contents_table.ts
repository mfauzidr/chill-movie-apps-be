
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("contents", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table
      .specificType("uuid", "CHAR(36)")
      .notNullable()
      .defaultTo(knex.raw("(UUID())"));

    table.string("title", 255).notNullable();
    table.date("release_date").notNullable();
    table.text("synopsis").notNullable();
    table.string("age_rating", 10).notNullable();
    table.text("poster").notNullable();
    table.text("banner").notNullable();
    table.string("content_type", 20).notNullable();

    table
      .specificType("is_premium", "TINYINT(1)")
      .notNullable()
      .defaultTo(0);

    table
      .specificType("is_active", "TINYINT(1)")
      .notNullable()
      .defaultTo(1);

    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

    table.timestamp("updated_at").nullable().defaultTo(null);

    table.unique(["uuid"], "uuid");
    table.index(["is_active", "release_date"], "idx_contents_active_release_date");

    table.check(
      "content_type IN ('movie', 'series')",
      [],
      "chk_contents_content_type"
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("contents");
}
