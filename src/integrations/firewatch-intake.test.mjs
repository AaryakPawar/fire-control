import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { MockFireWatchAdapter } from "./mock-firewatch-adapter.mjs";
import { IncidentSnapshotValidationError } from "./incident-snapshot-validator.mjs";

const valid = JSON.parse(await readFile(
  new URL("./fixtures/firewatch-incident.json", import.meta.url), "utf8"
));
for (const [name, change, matches] of [
  ["missing snapshotId", s => { delete s.snapshotId; }, e => e.params.missingProperty === "snapshotId"],
  ["missing incidentId", s => { delete s.incidentId; }, e => e.params.missingProperty === "incidentId"],
  ["invalid timestamp", s => { s.observedAt = "invalid-date"; }, e => e.keyword === "format" && e.instancePath === "/observedAt"],
  ["invalid zones", s => { s.zones = [{}]; }, e => e.params.missingProperty === "zoneId"],
  ["invalid severity", s => { s.severity = 42; }, e => e.keyword === "type" && e.instancePath === "/severity"]
]) {
  test(`runtime intake rejects ${name} with identifiable errors`, async t => {
    const dir = await mkdtemp(join(tmpdir(), "firecontrol-intake-"));
    t.after(() => rm(dir, { recursive: true, force: true }));
    const snapshot = structuredClone(valid);
    change(snapshot);
    const snapshotFile = join(dir, "snapshot.json");
    await writeFile(snapshotFile, JSON.stringify(snapshot));
    const adapter = new MockFireWatchAdapter({ snapshotFile });
    await assert.rejects(adapter.getIncidentSnapshot(valid.incidentId), error => {
      assert.ok(error instanceof IncidentSnapshotValidationError);
      assert.equal(error.code, "INVALID_INCIDENT_SNAPSHOT");
      assert.ok(error.errors.some(matches));
      return true;
    });
  });
}
