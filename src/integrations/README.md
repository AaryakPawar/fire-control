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

These tests cover provisional FireControl contract/mock behavior, including
schema failures and command response lifecycles. They do not establish actual
FireWatch v1.0.0 compatibility, a running operator application, or live FireSim
integration. Runtime intake validation in PR #29 remains a separate change
until merged; this verification change does not add its five regression tests.
