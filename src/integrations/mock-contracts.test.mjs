import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { MockFireWatchAdapter } from "./mock-firewatch-adapter.mjs";
import { MockFireSimAdapter } from "./mock-firesim-adapter.mjs";

const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

// Validate against schemas from this checkout, never another branch.
function loadValidator(path) {
  const local = new URL(`../../${path}`, import.meta.url);
  let content;
  try {
    content = readFileSync(local, "utf8");
  } catch (cause) {
    throw new Error(`Cannot load required schema from this checkout: ${path}`, {
      cause
    });
  }
  return ajv.compile(JSON.parse(content));
}

const validateSnapshot = loadValidator(
  "contracts/firewatch/incident-snapshot.schema.json"
);
const validateRequest = loadValidator(
  "contracts/firesim/command-request.schema.json"
);
const validateStatus = loadValidator(
  "contracts/firesim/command-status.schema.json"
);

function loadFixture(name) {
  return JSON.parse(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8"));
}

function assertValid(validate, value) {
  assert.equal(validate(value), true, JSON.stringify(validate.errors));
}

test("mock FireWatch response satisfies its owned contract", async () => {
  const fixture = loadFixture("firewatch-incident.json");
  const snapshot = await new MockFireWatchAdapter().getIncidentSnapshot(fixture.incidentId);
  assertValid(validateSnapshot, snapshot);
});

test("mock FireSim request fixture satisfies its owned contract", () => {
  assertValid(validateRequest, loadFixture("firesim-command-request.json"));
});

for (const [scenario, expectedStates] of [
  ["success", ["ACCEPTED", "RUNNING", "COMPLETED"]],
  ["rejected", ["REJECTED", "REJECTED", "REJECTED"]],
  ["failed", ["ACCEPTED", "RUNNING", "FAILED"]]
]) {
  test(`mock FireSim ${scenario} responses satisfy their owned contract`, async () => {
    const adapter = new MockFireSimAdapter({ scenario });
    const request = loadFixture("firesim-command-request.json");
    const responses = [await adapter.submitCommand(request)];
    responses.push(await adapter.advanceCommand(request.requestId));
    responses.push(await adapter.advanceCommand(request.requestId));
    for (const [index, response] of responses.entries()) {
      assertValid(validateStatus, response);
      assert.equal(response.state, expectedStates[index]);
      assert.equal(response.requestId, request.requestId);
    }
    assertValid(validateStatus, await adapter.getCommandStatus(request.requestId));
  });
}

test("contract validation detects malformed mock payloads", () => {
  const snapshot = loadFixture("firewatch-incident.json");
  snapshot.observedAt = "invalid-date";
  assert.equal(validateSnapshot(snapshot), false);
  assert.ok(validateSnapshot.errors.some(error => error.keyword === "format"));

  const request = loadFixture("firesim-command-request.json");
  delete request.resourceId;
  assert.equal(validateRequest(request), false);
  assert.ok(validateRequest.errors.some(error => error.params.missingProperty === "resourceId"));

  assert.equal(validateStatus({
    requestId: "REQ-DEMO-001", state: "UNKNOWN", occurredAt: "2026-10-26T12:00:00Z"
  }), false);
  assert.ok(validateStatus.errors.some(error => error.keyword === "enum"));
});
