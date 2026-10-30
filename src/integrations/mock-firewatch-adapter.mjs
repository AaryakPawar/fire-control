import { readFile } from "node:fs/promises";
import { validateIncidentSnapshot } from "./incident-snapshot-validator.mjs";

const SNAPSHOT_FILE = new URL(
  "./fixtures/firewatch-incident.json",
  import.meta.url
);

export class MockFireWatchAdapter {
  constructor({ scenario = "success", snapshotFile = SNAPSHOT_FILE } = {}) {
    if (!["success", "unavailable"].includes(scenario)) {
      throw new Error("Unsupported FireWatch mock scenario");
    }

    this.scenario = scenario;
    this.snapshotFile = snapshotFile;
  }

  async getIncidentSnapshot(incidentId) {
    if (typeof incidentId !== "string" || !incidentId.trim()) {
      throw new TypeError(
        "incidentId must be a non-empty string"
      );
    }

    if (this.scenario === "unavailable") {
      throw new Error(
        "Mock FireWatch communication failure"
      );
    }

    const content = await readFile(this.snapshotFile, "utf8");
    const snapshot = validateIncidentSnapshot(JSON.parse(content));

    if (snapshot.incidentId !== incidentId) {
      return null;
    }

    return snapshot;
  }
}
