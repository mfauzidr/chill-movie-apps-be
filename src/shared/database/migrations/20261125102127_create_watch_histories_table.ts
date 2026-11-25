
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("watch_histories", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table.specificType("user_uuid", "CHAR(36)").notNullable();
    table.specificType("content_uuid", "CHAR(36)").notNullable();
    table.integer("episode_id").nullable();

    table.integer("progress_seconds").notNullable().defaultTo(0);

    table
      .timestamp("last_watched_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

    table.timestamp("updated_at").nullable().defaultTo(null);

    table.unique(
      ["user_uuid", "content_uuid"],
      "uq_watch_histories_user_content"
    );

    table.index(["content_uuid"], "content_uuid");
    table.index(["episode_id"], "watch_histories_ibfk_3");

    table.index(
      ["user_uuid", "last_watched_at"],
      "idx_watch_histories_user_last_watched"
    );

    table
      .foreign("user_uuid", "watch_histories_ibfk_1")
      .references("uuid")
      .inTable("users");

    table
      .foreign("content_uuid", "watch_histories_ibfk_2")
      .references("uuid")
      .inTable("contents");

    table
      .foreign("episode_id", "watch_histories_ibfk_3")
      .references("id")
      .inTable("episodes");

    table.check(
      "progress_seconds >= 0",
      [],
      "chk_watch_histories_progress"
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("watch_histories");
}
