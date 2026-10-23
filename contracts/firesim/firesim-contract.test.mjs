
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

// Load JSON relative to this test file.
function loadJSON(path) {
  const fileURL = new URL(path, import.meta.url);
  return JSON.parse(readFileSync(fileURL, "utf8"));
}

// Load both assumed FireSim contracts.
const requestSchema = loadJSON(
  "./command-request.schema.json"
);

const statusSchema = loadJSON(
  "./command-status.schema.json"
);

// Configure JSON Schema Draft 2020-12 validation.
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

const validateRequest = ajv.compile(requestSchema);
const validateStatus = ajv.compile(statusSchema);

// Test 1: Valid CommandRequest.
test("accepts a valid FireSim CommandRequest", () => {
  const data = loadJSON(
    "./fixtures/valid-command-request.json"
  );

  assert.equal(
    validateRequest(data),
    true,
    JSON.stringify(validateRequest.errors)
  );
});

// Test 2: Missing resourceId.
test("rejects CommandRequest without resourceId", () => {
  const data = loadJSON(
    "./fixtures/invalid-command-request.json"
  );

  assert.equal(validateRequest(data), false);

  assert.ok(
    validateRequest.errors.some(
      (error) =>
        error.keyword === "required" &&
        error.params.missingProperty === "resourceId"
    ),
    "Expected missing resourceId validation error"
  );
});

// Test 3: Valid CommandStatus.
test("accepts a valid FireSim CommandStatus", () => {
  const data = loadJSON(
    "./fixtures/valid-command-status.json"
  );

  assert.equal(
    validateStatus(data),
    true,
    JSON.stringify(validateStatus.errors)
  );
});

// Test 4: Unsupported status value.
test("rejects unsupported FireSim status", () => {
  const data = loadJSON(
    "./fixtures/invalid-command-status.json"
  );

  assert.equal(validateStatus(data), false);

  assert.ok(
    validateStatus.errors.some(
      (error) => error.keyword === "enum"
    ),
    "Expected unsupported status validation error"
  );
});
