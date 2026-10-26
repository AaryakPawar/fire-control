import test from "node:test";
import assert from "node:assert/strict";

import { MockFireWatchAdapter } from "./mock-firewatch-adapter.mjs";

test("returns a valid mock incident snapshot", async () => {
  const adapter = new MockFireWatchAdapter();

  const snapshot = await adapter.getIncidentSnapshot(
    "INC-DEMO-001"
  );

  assert.equal(snapshot.snapshotId, "SNAP-DEMO-001");
  assert.equal(snapshot.incidentId, "INC-DEMO-001");
  assert.equal(snapshot.severity, "HIGH");
  assert.equal(snapshot.zones.length, 2);
  assert.equal(snapshot.zones[0].zoneId, "ZONE-001");
});

test("returns null for an unknown incident", async () => {
  const adapter = new MockFireWatchAdapter();

  const result = await adapter.getIncidentSnapshot(
    "INC-UNKNOWN"
  );

  assert.equal(result, null);
});

test("simulates a FireWatch communication failure", async () => {
  const adapter = new MockFireWatchAdapter({
    scenario: "unavailable"
  });

  await assert.rejects(
    adapter.getIncidentSnapshot("INC-DEMO-001"),
    /Mock FireWatch communication failure/
  );
});

test("rejects an empty incident ID", async () => {
  const adapter = new MockFireWatchAdapter();

  await assert.rejects(
    adapter.getIncidentSnapshot(""),
    TypeError
  );
});

test("rejects unsupported mock scenarios", () => {
  assert.throws(
    () => new MockFireWatchAdapter({
      scenario: "invalid"
    }),
    /Unsupported FireWatch mock scenario/
  );
});

test("returns independent snapshot objects", async () => {
  const adapter = new MockFireWatchAdapter();

  const first = await adapter.getIncidentSnapshot(
    "INC-DEMO-001"
  );

  first.severity = "MODIFIED";

  const second = await adapter.getIncidentSnapshot(
    "INC-DEMO-001"
  );

  assert.equal(second.severity, "HIGH");
});
