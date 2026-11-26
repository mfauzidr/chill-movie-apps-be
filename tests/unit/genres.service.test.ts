import "../setup";
import assert from "node:assert/strict";
import { test } from "node:test";
import * as genresService from "../../src/modules/genres/genres.service";

test("genres.insert rejects blank names", async () => {
  await assert.rejects(genresService.insert({ name: " " }), {
    code: "INVALID_NAME",
    statusCode: 400,
  });
});

test("genres.insert rejects unknown fields", async () => {
  await assert.rejects(
    genresService.insert({ name: "Drama", unexpected: "value" } as never),
    { code: "INVALID_FIELD", statusCode: 400 },
  );
});
