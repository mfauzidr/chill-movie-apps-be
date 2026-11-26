import "../setup";
import assert from "node:assert/strict";
import { test } from "node:test";
import request from "supertest";
import app from "../../src/app";

test("POST /users maps password validation to the HTTP error contract", async () => {
  const response = await request(app).post("/users").send({
    username: "Jamie",
    email: "jamie@example.com",
    password: " ",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    success: false,
    message: "Password must be a non-empty string",
  });
});

test("POST /genres maps validation errors to the HTTP error contract", async () => {
  const response = await request(app).post("/genres").send({ name: " " });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    success: false,
    message: "Name must be a non-empty string",
  });
});

test("POST /producers maps validation errors to the HTTP error contract", async () => {
  const response = await request(app).post("/producers").send({ name: " " });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    success: false,
    message: "Name must be a non-empty string",
  });
});
