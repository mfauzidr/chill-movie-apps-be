
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_packages", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table.specificType("user_uuid", "CHAR(36)").notNullable();
    table.specificType("package_uuid", "CHAR(36)").notNullable();

    table.dateTime("start_date").notNullable();
    table.dateTime("end_date").notNullable();
    table.string("status", 20).notNullable();

    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

    table.timestamp("updated_at").nullable().defaultTo(null);

    table.index(
      ["user_uuid", "status"],
      "idx_user_packages_user_status"
    );

    table.index(
      ["package_uuid"],
      "idx_user_packages_package_uuid"
    );

    table
      .foreign("user_uuid", "user_packages_ibfk_1")
      .references("uuid")
      .inTable("users");

    table
      .foreign("package_uuid", "user_packages_ibfk_2")
      .references("uuid")
      .inTable("packages");

    table.check(
      "end_date > start_date",
      [],
      "chk_user_packages_date_range"
    );

    table.check(
      "status IN ('active', 'expired', 'cancelled')",
      [],
      "chk_user_packages_status"
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("user_packages");
}
