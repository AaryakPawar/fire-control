import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { MockFireSimAdapter } from "./mock-firesim-adapter.mjs";

const fixture = JSON.parse(
  readFileSync(
    new URL("./fixtures/firesim-command-request.json", import.meta.url),
    "utf8"
  )
);

function createRequest() {
  return structuredClone(fixture);
}

test("accepts a valid command request", async () => {
  const adapter = new MockFireSimAdapter();
  const request = createRequest();

  const result = await adapter.submitCommand(request);

  assert.equal(result.requestId, request.requestId);
  assert.equal(result.state, "ACCEPTED");
  assert.ok(!Number.isNaN(Date.parse(result.occurredAt)));

  const stored = await adapter.getCommandStatus(request.requestId);
  assert.equal(stored.state, "ACCEPTED");
});

test("advances command through the successful lifecycle", async () => {
  const adapter = new MockFireSimAdapter();
  const request = createRequest();

  await adapter.submitCommand(request);

  const running = await adapter.advanceCommand(request.requestId);
  assert.equal(running.state, "RUNNING");

  const completed = await adapter.advanceCommand(request.requestId);
  assert.equal(completed.state, "COMPLETED");

  const final = await adapter.getCommandStatus(request.requestId);
  assert.equal(final.state, "COMPLETED");
});

test("does not advance a completed command", async () => {
  const adapter = new MockFireSimAdapter();
  const request = createRequest();

  await adapter.submitCommand(request);
  await adapter.advanceCommand(request.requestId);
  await adapter.advanceCommand(request.requestId);

  const result = await adapter.advanceCommand(request.requestId);
  assert.equal(result.state, "COMPLETED");
});

test("rejects commands in the rejected scenario", async () => {
  const adapter = new MockFireSimAdapter({
    scenario: "rejected"
  });

  const request = createRequest();
  const result = await adapter.submitCommand(request);

  assert.equal(result.state, "REJECTED");

  const next = await adapter.advanceCommand(request.requestId);
  assert.equal(next.state, "REJECTED");
});

test("simulates execution failure", async () => {
  const adapter = new MockFireSimAdapter({
    scenario: "failed"
  });

  const request = createRequest();

  await adapter.submitCommand(request);
  await adapter.advanceCommand(request.requestId);

  const result = await adapter.advanceCommand(request.requestId);

  assert.equal(result.state, "FAILED");
});

test("simulates communication failure", async () => {
  const adapter = new MockFireSimAdapter({
    scenario: "unavailable"
  });

  await assert.rejects(
    adapter.submitCommand(createRequest()),
    /Mock FireSim communication failure/
  );

  await assert.rejects(
    adapter.getCommandStatus("REQ-DEMO-001"),
    /Mock FireSim communication failure/
  );
});

test("rejects missing required fields", async () => {
  const adapter = new MockFireSimAdapter();
  const request = createRequest();

  delete request.resourceId;

  await assert.rejects(
    adapter.submitCommand(request),
    /Invalid or missing field: resourceId/
  );
});

test("rejects invalid plan revisions", async () => {
  const adapter = new MockFireSimAdapter();
  const request = createRequest();

  request.planRevision = 0;

  await assert.rejects(
    adapter.submitCommand(request),
    /Invalid planRevision/
  );
});

test("prevents duplicate command requests", async () => {
  const adapter = new MockFireSimAdapter();
  const request = createRequest();

  await adapter.submitCommand(request);

  await assert.rejects(
    adapter.submitCommand(request),
    /Duplicate requestId/
  );
});

test("returns null for unknown commands", async () => {
  const adapter = new MockFireSimAdapter();

  const result = await adapter.getCommandStatus("REQ-UNKNOWN");

  assert.equal(result, null);
});
