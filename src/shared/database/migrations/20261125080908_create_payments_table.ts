
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("payments", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table
      .specificType("uuid", "CHAR(36)")
      .notNullable()
      .defaultTo(knex.raw("(UUID())"));

    table.specificType("order_uuid", "CHAR(36)").notNullable();

    table.string("payment_method", 50).notNullable();
    table.string("payment_code", 255).nullable();
    table.string("status", 20).notNullable().defaultTo("pending");

    table.timestamp("expired_at").nullable().defaultTo(null);
    table.timestamp("paid_at").nullable().defaultTo(null);

    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

    table.timestamp("updated_at").nullable().defaultTo(null);

    table.unique(["order_uuid"], "order_uuid");
    table.unique(["uuid"], "uq_payments_uuid");

    table.index(["payment_code"], "idx_payments_payment_code");

    table
      .foreign("order_uuid", "payments_ibfk_1")
      .references("uuid")
      .inTable("orders");

    table.check(
      "status IN ('pending', 'paid', 'expired', 'failed')",
      [],
      "chk_payments_status"
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("payments");
}
