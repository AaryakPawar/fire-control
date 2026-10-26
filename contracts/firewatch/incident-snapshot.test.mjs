
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

// Load JSON relative to this test file.
function loadJSON(relativePath) {
  const fileURL = new URL(relativePath, import.meta.url);
  return JSON.parse(readFileSync(fileURL, "utf8"));
}

// Configure the FireWatch JSON Schema validator.
const schema = loadJSON("./incident-snapshot.schema.json");

const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(schema);

// Original test 1: Valid snapshot.
test("accepts a valid FireWatch IncidentSnapshot", () => {
  const snapshot = loadJSON(
    "./fixtures/valid-incident-snapshot.json"
  );

  const result = validate(snapshot);

  assert.equal(result, true, JSON.stringify(validate.errors));
});

// Original test 2: Missing incidentId.
test("rejects an IncidentSnapshot without incidentId", () => {
  const snapshot = loadJSON(
    "./fixtures/invalid-incident-snapshot.json"
  );

  assert.equal(validate(snapshot), false);

  assert.ok(
    validate.errors.some(
      (error) =>
        error.keyword === "required" &&
        error.params.missingProperty === "incidentId"
    ),
    "Expected a missing incidentId validation error"
  );
});

// Additional negative tests requested during peer review.
const invalidCases = [
  {
    name: "missing snapshotId",
    change: (s) => { delete s.snapshotId; },
    keyword: "required",
    missingProperty: "snapshotId"
  },
  {
    name: "missing observedAt",
    change: (s) => { delete s.observedAt; },
    keyword: "required",
    missingProperty: "observedAt"
  },
  {
    name: "invalid timestamp",
    change: (s) => { s.observedAt = "not-a-date"; },
    keyword: "format",
    path: "/observedAt"
  },
  {
    name: "incorrect severity type",
    change: (s) => { s.severity = 42; },
    keyword: "type",
    path: "/severity"
  },
  {
    name: "empty snapshotId",
    change: (s) => { s.snapshotId = ""; },
    keyword: "minLength",
    path: "/snapshotId"
  },
  {
    name: "empty incidentId",
    change: (s) => { s.incidentId = ""; },
    keyword: "minLength",
    path: "/incidentId"
  },
  {
    name: "incorrect zones type",
    change: (s) => { s.zones = "N-01"; },
    keyword: "type",
    path: "/zones"
  },
  {
    name: "zone object missing zoneId",
    change: (s) => { s.zones = [{}]; },
    keyword: "required",
    missingProperty: "zoneId"
  }
];

for (const testCase of invalidCases) {
  test(`rejects IncidentSnapshot with ${testCase.name}`, () => {
    const snapshot = loadJSON(
      "./fixtures/valid-incident-snapshot.json"
    );

    testCase.change(snapshot);

    assert.equal(
      validate(snapshot),
      false,
      `Expected rejection: ${testCase.name}`
    );

    const matchingError = (validate.errors ?? []).some(
      (error) =>
        error.keyword === testCase.keyword &&
        (
          testCase.missingProperty
            ? error.params.missingProperty === testCase.missingProperty
            : error.instancePath === testCase.path
        )
    );

    assert.ok(
      matchingError,
      `Expected ${testCase.keyword} error: ` +
        JSON.stringify(validate.errors)
    );
  });
}
