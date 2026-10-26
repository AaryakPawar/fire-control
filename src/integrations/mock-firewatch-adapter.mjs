import { readFile } from "node:fs/promises";

const SNAPSHOT_FILE = new URL(
  "./fixtures/firewatch-incident.json",
  import.meta.url
);

export class MockFireWatchAdapter {
  constructor({ scenario = "success" } = {}) {
    if (!["success", "unavailable"].includes(scenario)) {
      throw new Error("Unsupported FireWatch mock scenario");
    }

    this.scenario = scenario;
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

    const content = await readFile(SNAPSHOT_FILE, "utf8");
    const snapshot = JSON.parse(content);

    if (snapshot.incidentId !== incidentId) {
      return null;
    }

    return snapshot;
  }
}
