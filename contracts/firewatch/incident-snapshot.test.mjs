
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

// Read JSON files relative to this test file.
function loadJSON(relativePath) {
  const fileURL = new URL(relativePath, import.meta.url);
  return JSON.parse(readFileSync(fileURL, "utf8"));
}

// Load the proposed FireWatch contract.
const schema = loadJSON("./incident-snapshot.schema.json");

// Configure the JSON Schema validator.
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(schema);

// Test 1: Valid snapshot must pass.
test("accepts a valid FireWatch IncidentSnapshot", () => {
  const snapshot = loadJSON(
    "./fixtures/valid-incident-snapshot.json"
  );

  const result = validate(snapshot);

  assert.equal(result, true, JSON.stringify(validate.errors));
});

// Test 2: Missing incidentId must fail.
test("rejects an IncidentSnapshot without incidentId", () => {
  const snapshot = loadJSON(
    "./fixtures/invalid-incident-snapshot.json"
  );

  const result = validate(snapshot);

  assert.equal(result, false);

  assert.ok(
    validate.errors.some(
      (error) =>
        error.keyword === "required" &&
        error.params.missingProperty === "incidentId"
    ),
    "Expected a missing incidentId validation error"
  );
});
