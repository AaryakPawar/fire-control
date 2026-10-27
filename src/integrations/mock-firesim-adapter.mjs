const SCENARIOS = [
  "success",
  "rejected",
  "failed",
  "unavailable"
];

const REQUIRED_STRINGS = [
  "requestId",
  "commandId",
  "planId",
  "incidentId",
  "actionType",
  "zoneId",
  "resourceId",
  "priority"
];

export class MockFireSimAdapter {
  constructor({ scenario = "success" } = {}) {
    if (!SCENARIOS.includes(scenario)) {
      throw new Error("Unsupported FireSim mock scenario");
    }

    this.scenario = scenario;
    this.statuses = new Map();
  }

  checkAvailability() {
    if (this.scenario === "unavailable") {
      throw new Error("Mock FireSim communication failure");
    }
  }

  validateRequest(request) {
    if (!request || typeof request !== "object" ||
        Array.isArray(request)) {
      throw new TypeError("Invalid FireSim command request");
    }

    for (const field of REQUIRED_STRINGS) {
      if (
        typeof request[field] !== "string" ||
        !request[field].trim()
      ) {
        throw new TypeError(
          `Invalid or missing field: ${field}`
        );
      }
    }

    if (
      !Number.isInteger(request.planRevision) ||
      request.planRevision < 1
    ) {
      throw new TypeError("Invalid planRevision");
    }
  }

  createStatus(requestId, state, message) {
    return {
      requestId,
      state,
      occurredAt: new Date().toISOString(),
      message
    };
  }

  async submitCommand(request) {
    this.checkAvailability();
    this.validateRequest(request);

    if (this.statuses.has(request.requestId)) {
      throw new Error("Duplicate requestId");
    }

    const rejected = this.scenario === "rejected";

    const status = this.createStatus(
      request.requestId,
      rejected ? "REJECTED" : "ACCEPTED",
      rejected
        ? "Command rejected by mock FireSim."
        : "Command accepted by mock FireSim."
    );

    this.statuses.set(request.requestId, status);

    return { ...status };
  }

  async getCommandStatus(requestId) {
    this.checkAvailability();

    if (typeof requestId !== "string" || !requestId.trim()) {
      throw new TypeError("Invalid requestId");
    }

    const status = this.statuses.get(requestId);

    return status ? { ...status } : null;
  }

  async advanceCommand(requestId) {
    const current = await this.getCommandStatus(requestId);

    if (!current) {
      return null;
    }

    let nextState;

    if (current.state === "ACCEPTED") {
      nextState = "RUNNING";
    } else if (current.state === "RUNNING") {
      nextState =
        this.scenario === "failed"
          ? "FAILED"
          : "COMPLETED";
    } else {
      return current;
    }

    const status = this.createStatus(
      requestId,
      nextState,
      `Mock FireSim command ${nextState.toLowerCase()}.`
    );

    this.statuses.set(requestId, status);

    return { ...status };
  }
}
