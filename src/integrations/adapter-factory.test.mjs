
import test from "node:test";
import assert from "node:assert/strict";

import { createIntegrationAdapters } from "./adapter-factory.mjs";
import { MockFireWatchAdapter } from "./mock-firewatch-adapter.mjs";
import { MockFireSimAdapter } from "./mock-firesim-adapter.mjs";

test("creates both mock adapters", () => {
  const { fireWatch, fireSim } = createIntegrationAdapters({
    mode: "mock"
  });

  assert.ok(fireWatch instanceof MockFireWatchAdapter);
  assert.ok(fireSim instanceof MockFireSimAdapter);
});

test("supports configurable mock scenarios", () => {
  const { fireWatch, fireSim } = createIntegrationAdapters({
    mode: "mock",
    fireWatchScenario: "unavailable",
    fireSimScenario: "failed"
  });

  assert.equal(fireWatch.scenario, "unavailable");
  assert.equal(fireSim.scenario, "failed");
});

test("does not silently use mocks in real mode", () => {
  assert.throws(
    () => createIntegrationAdapters({ mode: "real" }),
    /FireWatch adapter must implement/
  );
});

test("requires both real integrations", () => {
  const watch = {
    getIncidentSnapshot: async () => null
  };

  assert.throws(
    () => createIntegrationAdapters({
      mode: "real",
      realFireWatchAdapter: watch
    }),
    /FireSim adapter must implement/
  );
});

test("accepts compatible injected real adapters", () => {
  const watch = {
    getIncidentSnapshot: async () => null
  };

  const sim = {
    submitCommand: async () => null,
    getCommandStatus: async () => null
  };

  const result = createIntegrationAdapters({
    mode: "real",
    realFireWatchAdapter: watch,
    realFireSimAdapter: sim
  });

  assert.equal(result.fireWatch, watch);
  assert.equal(result.fireSim, sim);
});

test("rejects an invalid FireWatch adapter", () => {
  const sim = {
    submitCommand: async () => null,
    getCommandStatus: async () => null
  };

  assert.throws(
    () => createIntegrationAdapters({
      mode: "real",
      realFireWatchAdapter: {},
      realFireSimAdapter: sim
    }),
    /FireWatch adapter must implement/
  );
});

test("rejects unsupported integration modes", () => {
  assert.throws(
    () => createIntegrationAdapters({ mode: "invalid" }),
    /Unsupported integration mode/
  );
});

test("rejects unsupported mock scenarios", () => {
  assert.throws(
    () => createIntegrationAdapters({
      mode: "mock",
      fireSimScenario: "invalid"
    }),
    /Unsupported FireSim mock scenario/
  );
});
