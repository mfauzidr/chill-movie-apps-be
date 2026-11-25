
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("packages", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table
      .specificType("uuid", "CHAR(36)")
      .notNullable()
      .defaultTo(knex.raw("(UUID())"));

    table.string("name", 100).notNullable();
    table.decimal("price", 12, 2).notNullable();
    table.text("benefits").notNullable();
    table.text("tnc").notNullable();

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

    table.check("price >= 0", [], "chk_packages_price");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("packages");
}
