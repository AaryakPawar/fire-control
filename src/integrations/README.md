# Contract and mock integration verification

From a fresh checkout, use Node.js 22 (the same major version as CI), then run:

```sh
npm ci
npm test
```

`npm ci` installs the versions recorded in `package-lock.json`. `npm test` runs
all three suites: FireWatch contracts, FireSim contracts, and mock integrations.
The main-branch and pull-request job `FireWatch and FireSim Tests` uses these same
commands in `.github/workflows/mock-integrations.yml`.

For a focused local check only:

```sh
npm run test:contracts          # FireWatch contracts only
npm run test:contracts:firesim  # FireSim contracts only
npm run test:integrations       # Mock integration tests only
```

Tests validate the schemas in `contracts/` from the checkout under test using
Ajv Draft 2020-12 and date-time formats. Missing schemas fail with their local
path. No Git metadata, remote-tracking refs, feature-branch fetches, running
broker, database, or live peer service are needed to run the suites after
installing dependencies. Dependency installation requires registry access or a
populated npm cache.

With the runtime intake repair from merged PR #29, the complete command covers
49 tests: 10 FireWatch contract, 4 FireSim contract and 35 integration tests.
These tests cover provisional FireControl contract/mock behavior, including
schema failures and command response lifecycles. Actual FireWatch v1.0.0
compatibility, a running operator application and live FireSim integration
remain unverified.

## Runtime FireWatch intake validation

`MockFireWatchAdapter.getIncidentSnapshot()` validates the parsed payload against
the local FireWatch schema before checking the incident identifier or returning
data. Schema failures throw `IncidentSnapshotValidationError` with code
`INVALID_INCIDENT_SNAPSHOT` and a copied Ajv `errors` array (including keyword,
instance path and parameters). Unknown incidents return null only after payload
validation. The optional `snapshotFile` constructor setting permits isolated
fixture-based tests; the default fixture is unchanged.

The shared `validateIncidentSnapshot` function is available for future real
adapters; this change does not implement a real FireWatch transport. The schema
remains provisional as documented in CONTRACT_ASSUMPTIONS.md. File I/O and JSON
syntax errors retain their native errors. Ajv packages are runtime dependencies.
