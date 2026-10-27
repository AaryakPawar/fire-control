# FireWatch IncidentSnapshot — Contract Assumptions

**Project:** FireControl — CSYE 7230
**Integration:** FireWatch → FireControl
**Contract Status:** PROPOSED / ASSUMED FOR DEVELOPMENT
**Specification:** JSON Schema Draft 2020-12
**Related Issue:** #11
**Related Pull Request:** #26

## 1. Purpose

This document describes the provisional interface assumptions used by FireControl to consume wildfire incident information from FireWatch.

Following Professor Maged Elaasar's guidance, FireControl is being developed using documented interface assumptions while coordination with the FireWatch team continues.

The contract supports independent development, schema validation, mock testing, and subsequent integration.

These assumptions have not been formally confirmed by the FireWatch team.

## 2. Assumed IncidentSnapshot Structure

The current proposed schema defines the following fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `snapshotId` | string | Yes | Unique identifier for an incident snapshot |
| `incidentId` | string | Yes | Identifier of the associated wildfire incident |
| `observedAt` | string (date-time) | Yes | Timestamp when the snapshot was observed |
| `severity` | string | Yes | FireWatch-reported incident severity |
| `zones` | array of objects | Yes | Affected zones, each identified by `zoneId` |
| `weather` | object | No | Optional weather information |
| `resources` | array of objects | No | Optional resource information |

Required string identifiers must not be empty. The `observedAt` value must conform to the JSON Schema `date-time` format.

These constraints reflect the current proposed schema rather than an externally approved FireWatch specification.

## 3. Severity Assumptions

FireControl currently expects severity to be represented as a string.

The final set of severity values, capitalization rules, ordering, and interpretation remain subject to agreement with the FireWatch team.

FireControl must not assume that an arbitrary severity value has a particular operational meaning without an agreed convention.

Any future severity enumeration should be reflected in the JSON Schema, fixtures, and automated contract tests.

## 4. Zone Assumptions

Each zone is represented as an object containing a nonempty `zoneId` string.

Zone identifiers are treated as references to operational areas. Their precise naming conventions, geographic representation, hierarchy, and relationship to map coordinates remain provisional.

FireControl does not calculate fire geometry from zone identifiers.

Any additional rules concerning zone uniqueness, minimum zone counts, or geospatial attributes require explicit contract agreement and corresponding validation.

## 5. Weather and Resource Assumptions

Weather and resources are optional contextual fields.

The current contract allows these fields without requiring complete operational weather or resource models.

The following details remain to be negotiated:

- Weather units, measurement conventions, and observation timestamps.
- Resource identifiers, categories, availability, and capacity representations.
- Whether resource availability originates from FireWatch or another system.
- Behavior when contextual information is missing or outdated.

FireControl must not treat missing optional data as confirmed zero values or guaranteed resource unavailability.

## 6. Integration Responsibilities

**FireWatch responsibilities (assumed):**
- Produce incident snapshots using the agreed interface.
- Supply incident identifiers, observation times, severity, and zone information.
- Communicate changes to the contract before integration.

**FireControl responsibilities:**
- Consume incident data without modifying the FireWatch source system.
- Validate incoming payloads against the applicable schema.
- Distinguish valid, invalid, missing, and stale information.
- Associate response plans with the relevant incident snapshot.
- Keep response planning and operator approval under FireControl's responsibility.

Error handling and end-to-end integration behavior remain implementation work unless separately demonstrated.

## 7. Current Validation Evidence

The repository contains:

- `incident-snapshot.schema.json` — proposed JSON Schema.
- `fixtures/valid-incident-snapshot.json` — valid test payload.
- `fixtures/invalid-incident-snapshot.json` — invalid test payload.
- `incident-snapshot.test.mjs` — automated contract tests.
- A GitHub Actions workflow for FireWatch contract validation.

Ten automated FireWatch contract tests passed locally and in the recorded GitHub Actions run on October 25, 2026.

The tests cover valid payload acceptance and selected invalid cases involving missing fields, invalid timestamps, incorrect types, empty identifiers, and malformed zone objects.

Passing these tests establishes compliance with the proposed schema for those test cases. It does not demonstrate full real-world FireWatch compatibility.

## 8. Mock Integration and Limitations

For Part B, FireControl uses simulated FireWatch data and independently maintained test fixtures.

No live FireWatch service integration is claimed.

The current contract tests do not establish that an operator-facing application, live incident feed, or complete FireControl backend has been implemented.

Professor Elaasar has confirmed that mock integrations are sufficient for Part B, with actual cross-team integration potentially addressed in Part C.

## 9. Outstanding Coordination

Before attempting real integration, the FireControl and FireWatch teams should agree on:

1. Final field names, types, and required properties.
2. Severity values and their meanings.
3. Zone identifiers and geographic representations.
4. Weather and resource structures.
5. Snapshot update and versioning behavior.
6. Invalid, unavailable, and stale-data handling.
7. Transport and communication mechanisms.
8. Contract versioning and backward compatibility.

Agreed changes must be reflected in the schema, fixtures, tests, and documentation.

## 10. Contract Status

**PROPOSED — suitable for independent FireControl development and mock contract testing.**

**NOT YET VERIFIED — compatibility with the independently developed FireWatch implementation.**

The contract remains subject to coordination with collaborators during weekly project meetings.
