
import { MockFireWatchAdapter } from "./mock-firewatch-adapter.mjs";
import { MockFireSimAdapter } from "./mock-firesim-adapter.mjs";

/**
 * FireWatch adapter interface:
 *   getIncidentSnapshot(incidentId)
 *
 * FireSim adapter interface:
 *   submitCommand(request)
 *   getCommandStatus(requestId)
 *
 * Both mock and real adapters must implement
 * the corresponding methods.
 */

function validateAdapter(adapter, methods, name) {
  if (
    !adapter ||
    methods.some((method) => typeof adapter[method] !== "function")
  ) {
    throw new TypeError(
      `${name} adapter must implement: ${methods.join(", ")}`
    );
  }
}

export function createIntegrationAdapters({
  mode = process.env.FIRECONTROL_INTEGRATION_MODE ??
    (process.env.NODE_ENV === "production" ? "real" : "mock"),
  fireWatchScenario = "success",
  fireSimScenario = "success",
  realFireWatchAdapter,
  realFireSimAdapter
} = {}) {
  let fireWatch;
  let fireSim;

  if (mode === "mock") {
    fireWatch = new MockFireWatchAdapter({
      scenario: fireWatchScenario
    });

    fireSim = new MockFireSimAdapter({
      scenario: fireSimScenario
    });
  } else if (mode === "real") {
    fireWatch = realFireWatchAdapter;
    fireSim = realFireSimAdapter;
  } else {
    throw new Error(`Unsupported integration mode: ${mode}`);
  }

  validateAdapter(
    fireWatch,
    ["getIncidentSnapshot"],
    "FireWatch"
  );

  validateAdapter(
    fireSim,
    ["submitCommand", "getCommandStatus"],
    "FireSim"
  );

  return { fireWatch, fireSim };
}
