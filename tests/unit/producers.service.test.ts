import "../setup";
import assert from "node:assert/strict";
import { test } from "node:test";
import * as producersService from "../../src/modules/producers/producers.service";

test("producers.insert rejects blank names", async () => {
  await assert.rejects(producersService.insert({ name: " " }), {
    code: "INVALID_NAME",
    statusCode: 400,
  });
});

test("producers.insert rejects unknown fields", async () => {
  await assert.rejects(
    producersService.insert({ name: "North Star", unexpected: "value" } as never),
    { code: "INVALID_FIELD", statusCode: 400 },
  );
});
