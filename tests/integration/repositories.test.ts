import assert from "node:assert/strict";
import { test } from "node:test";
import type { Knex } from "knex";
import bcrypt from "bcrypt";
import request from "supertest";
import * as usersMigration from "../../src/shared/database/migrations/20261125074835_create_users_table";
import * as genresMigration from "../../src/shared/database/migrations/20261125075529_create_genres_table";
import * as producersMigration from "../../src/shared/database/migrations/20261125075837_create_producers_table";

const requiredSettings = [
  "TEST_DB_HOST",
  "TEST_DB_PORT",
  "TEST_DB_USER",
  "TEST_DB_PASSWORD",
  "TEST_DB_NAME",
] as const;

const assertDisposableDatabaseSettings = () => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Database integration tests require NODE_ENV=test");
  }
  if (process.env.RUN_DB_INTEGRATION !== "1") {
    throw new Error("Set RUN_DB_INTEGRATION=1 to enable database integration tests");
  }
  if (process.env.TEST_DB_DISPOSABLE !== "1") {
    throw new Error("Set TEST_DB_DISPOSABLE=1 only for a disposable test database");
  }
  for (const setting of requiredSettings) {
    const value = process.env[setting];
    if (value === undefined || (setting !== "TEST_DB_PASSWORD" && value.trim() === "")) {
      throw new Error(`Missing required test database setting: ${setting}`);
    }
  }
  if (!/_test$/i.test(process.env.TEST_DB_NAME ?? "")) {
    throw new Error("TEST_DB_NAME must end with _test");
  }
};

test(
  "repositories persist and retrieve users, genres, and producers",
  { skip: process.env.RUN_DB_INTEGRATION === "1" ? false : "RUN_DB_INTEGRATION is not set" },
  async (t) => {
  assertDisposableDatabaseSettings();

  const dbModule = (await import("../../src/shared/config/knex.js")) as unknown as {
    default: Knex;
  };
  const db = dbModule.default;
  const migrations: Array<{ up: (knex: Knex) => Promise<void>; down: (knex: Knex) => Promise<void> }> = [
    usersMigration,
    genresMigration,
    producersMigration,
  ];
  const tableNames = ["users", "genres", "producers"];
  const existingTables: string[] = [];
  const applied: typeof migrations = [];

  t.after(async () => {
    try {
      for (const migration of applied.reverse()) await migration.down(db);
    } finally {
      await db.destroy();
    }
  });

  for (const tableName of tableNames) {
    if (await db.schema.hasTable(tableName)) existingTables.push(tableName);
  }
  if (existingTables.length > 0) {
    throw new Error(
      `Refusing to alter existing test database tables: ${existingTables.join(", ")}`,
    );
  }

  for (const migration of migrations) {
    applied.push(migration);
    await migration.up(db);
  }

  const usersRepository = await import("../../src/modules/users/users.repository.js");
  const genresRepository = await import("../../src/modules/genres/genres.repository.js");
  const producersRepository = await import("../../src/modules/producers/producers.repository.js");
  const appModule = (await import("../../src/app.js")) as unknown as {
    default: Parameters<typeof request>[0];
  };

  const userResponse = await request(appModule.default).post("/users").send({
    username: "Repository Test",
    email: "repository-test@example.com",
    password: "repository test password",
  });
  assert.equal(userResponse.status, 201);
  assert.equal("password" in userResponse.body.results[0], false);
  const userUuid = userResponse.body.results[0].uuid as string;
  assert.equal(JSON.stringify(userResponse.body).includes("repository test password"), false);
  const [storedUsers] = await db.raw(
    "SELECT password FROM users WHERE uuid = ?",
    [userUuid],
  );
  assert.equal(
    await bcrypt.compare("repository test password", storedUsers[0].password),
    true,
  );
  assert.equal((await usersRepository.findAll()).length, 1);
  assert.equal((await usersRepository.findByUuid(userUuid)).length, 1);
  assert.equal(
    (await usersRepository.findExistingEmail("repository-test@example.com")).length,
    1,
  );
  const updatedUsers = await usersRepository.update(userUuid, {
    username: "Updated Repository Test",
  });
  assert.equal(updatedUsers[0]!.username, "Updated Repository Test");
  assert.equal("password" in updatedUsers[0]!, false);
  const updateResponse = await request(appModule.default)
    .patch(`/users/${userUuid}`)
    .send({ password: "updated repository password" });
  assert.equal(updateResponse.status, 200);
  assert.equal("password" in updateResponse.body.results[0], false);
  const [updatedStoredUsers] = await db.raw(
    "SELECT password FROM users WHERE uuid = ?",
    [userUuid],
  );
  assert.equal(
    await bcrypt.compare("updated repository password", updatedStoredUsers[0].password),
    true,
  );
  assert.equal(await usersRepository.deleteUser(userUuid), 1);

  const insertedGenres = await genresRepository.insert({ name: "Repository Genre" });
  assert.equal(insertedGenres.length, 1);
  const genreId = insertedGenres[0]!.id;
  assert.equal((await genresRepository.findAll()).length, 1);
  assert.equal((await genresRepository.findById(genreId)).length, 1);
  assert.equal((await genresRepository.findExistingGenre("Repository Genre")).length, 1);
  const updatedGenres = await genresRepository.update(genreId, {
    name: "Updated Repository Genre",
  });
  assert.equal(updatedGenres[0]!.name, "Updated Repository Genre");
  assert.equal(await genresRepository.deleteGenre(genreId), 1);

  const insertedProducers = await producersRepository.insert({ name: "Repository Producer" });
  assert.equal(insertedProducers.length, 1);
  const producerId = insertedProducers[0]!.id;
  assert.equal((await producersRepository.findAll()).length, 1);
  assert.equal((await producersRepository.findById(producerId)).length, 1);
  assert.equal(
    (await producersRepository.findExistingProducer("Repository Producer")).length,
    1,
  );
  const updatedProducers = await producersRepository.update(producerId, {
    name: "Updated Repository Producer",
  });
  assert.equal(updatedProducers[0]!.name, "Updated Repository Producer");
  assert.equal(await producersRepository.deleteProducer(producerId), 1);
  },
);
