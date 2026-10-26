
/*
 * Additional negative contract tests.
 * Each case starts with a valid IncidentSnapshot
 * and changes one field to verify rejection.
 */
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
      `Expected ${testCase.keyword} error for ${testCase.name}: ` +
        JSON.stringify(validate.errors)
    );
  });
}
