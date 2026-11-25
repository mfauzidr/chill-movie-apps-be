
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table
      .specificType("uuid", "CHAR(36)")
      .notNullable()
      .defaultTo(knex.raw("(UUID())"));

    table.string("username", 50).nullable();
    table.string("email", 255).notNullable();
    table.string("password", 255).notNullable();

    table
      .enu("role", ["admin", "user"])
      .notNullable()
      .defaultTo("user");

    table.text("image").nullable();

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
    table.unique(["email"], "uq_users_email");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
