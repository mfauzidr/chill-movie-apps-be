
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("orders", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table
      .specificType("uuid", "CHAR(36)")
      .notNullable()
      .defaultTo(knex.raw("(UUID())"));

    table.specificType("user_uuid", "CHAR(36)").notNullable();
    table.specificType("package_uuid", "CHAR(36)").notNullable();

    table.string("promo_code", 50).nullable();
    table.decimal("package_price", 12, 2).notNullable();
    table.decimal("discount", 12, 2).notNullable().defaultTo(0.00);
    table.decimal("admin_fee", 12, 2).notNullable().defaultTo(0.00);
    table.decimal("total_amount", 12, 2).notNullable();

    table.string("status", 20).notNullable().defaultTo("pending");

    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

    table.timestamp("updated_at").nullable().defaultTo(null);

    table.unique(["uuid"], "uuid");

    table.index(
      ["user_uuid", "created_at"],
      "idx_orders_user_created"
    );

    table.index(["package_uuid"], "idx_orders_package_uuid");

    table
      .foreign("user_uuid", "orders_ibfk_1")
      .references("uuid")
      .inTable("users");

    table
      .foreign("package_uuid", "orders_ibfk_2")
      .references("uuid")
      .inTable("packages");

    table.check("package_price >= 0", [], "chk_orders_package_price");
    table.check("discount >= 0", [], "chk_orders_discount");
    table.check("admin_fee >= 0", [], "chk_orders_admin_fee");
    table.check("total_amount >= 0", [], "chk_orders_total_amount");

    table.check(
      "status IN ('pending', 'completed', 'cancelled')",
      [],
      "chk_orders_status"
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("orders");
}
