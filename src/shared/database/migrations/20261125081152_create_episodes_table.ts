
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("episodes", (table) => {
    table.specificType("id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY");

    table.integer("season_id").notNullable();
    table.string("title", 255).nullable();
    table.integer("episode_number").notNullable();
    table.integer("duration").notNullable();

    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));

    table.timestamp("updated_at").nullable().defaultTo(null);

    table.unique(
      ["season_id", "episode_number"],
      "uq_episodes_season_number"
    );

    table
      .foreign("season_id", "episodes_ibfk_1")
      .references("id")
      .inTable("seasons");

    table.check("duration > 0", [], "chk_episodes_duration");
    table.check("episode_number > 0", [], "chk_episodes_number");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("episodes");
}
