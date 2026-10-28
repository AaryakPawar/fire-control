# Mock integration tests

Run from the repository root:

```sh
npm ci
git fetch --no-tags origin \
  +refs/heads/feature/firewatch-contract:refs/remotes/origin/feature/firewatch-contract \
  +refs/heads/feature/firesim-contract:refs/remotes/origin/feature/firesim-contract
npm run test:integrations
```

The contract tests validate mock snapshots, command requests, and response
lifecycles with AJV Draft 2020-12 and date-time format validation. Negative
cases verify that invalid dates, missing request fields, and unknown states
are rejected by the schemas.

Schemas belong to the contract contributors. Tests read files from `contracts/`
when available in this checkout; otherwise they read the named remote-tracking
branches with `git show`. No schema copies are maintained here. Missing schemas
fail the suite rather than skipping validation. Branch fallback uses the last
fetched revisions, so fetch before checking changes from contract contributors.

CI fetches these branches explicitly while the contracts remain unmerged.
Once both contracts are merged, remove that fetch step before deleting the
teammate branches. Keep the local schema paths in the tests.

`test:contracts` is inherited from the FireWatch package and runs its own tests
only when those contract files are present. Use `test:integrations` for this work.

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
