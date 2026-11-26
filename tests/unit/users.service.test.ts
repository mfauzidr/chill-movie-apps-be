import "../setup";
import assert from "node:assert/strict";
import { test } from "node:test";
import * as usersService from "../../src/modules/users/users.service";
import { repositoryCalls } from "../helpers/repositoryMocks";

test("users.insert rejects blank passwords", async () => {
  await assert.rejects(
    usersService.insert({
      username: "Jamie",
      email: "jamie@example.com",
      password: "   ",
    }),
    { code: "INVALID_PASSWORD", statusCode: 400 },
  );
});

test("users.insert uses the repository mock for valid input", async () => {
  repositoryCalls.users.findExistingEmail = 0;
  repositoryCalls.users.insert = 0;

  const result = await usersService.insert({
    username: "Jamie",
    email: "jamie@example.com",
    password: "valid password",
  });

  assert.equal(result[0]?.uuid, "test-user-uuid");
  assert.equal(repositoryCalls.users.findExistingEmail, 1);
  assert.equal(repositoryCalls.users.insert, 1);
});

test("users.insert rejects invalid fields before repository access", async () => {
  await assert.rejects(
    usersService.insert({
      username: "Jamie",
      email: "jamie@example.com",
      password: "secret",
      unexpected: "value",
    } as never),
    { code: "INVALID_FIELD", statusCode: 400 },
  );
});

test("users.update rejects blank passwords", async () => {
  await assert.rejects(
    usersService.update("user-uuid", { password: "  " }),
    { code: "INVALID_PASSWORD", statusCode: 400 },
  );
});
