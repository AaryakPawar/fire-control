# FireControl

> **Command, Planning & Response Coordination for Fire Force Six**

**Course:** CSYE 7230  
**Team:** FireControl  

| Team Member | NUID |
|---|---|
| Aaryak Pawar | 002065641 |
| Jamal Oyeyemi Akinlabi | 001647538 |

**GitHub Repository:**  
https://github.com/AaryakPawar/fire-control

---

## Reproducible verification

Use Node.js 22, matching CI. From a fresh checkout of this revision:

```sh
npm ci
npm test
```

`npm test` runs FireWatch contract tests, FireSim contract tests, and mock
integration tests in one command. The **FireWatch and FireSim Tests** job uses
the same `npm ci` and `npm test` commands on pull requests and pushes to main.
No feature-branch refs or fetches are required.
See [verification details](src/integrations/README.md) for focused suite commands.

Recorded evidence (October 30, 2026; commit-specific baselines):

| Baseline | Verified scope |
| --- | --- |
| Historical main `3739515` | 44 passing tests: 10 FireWatch + 4 FireSim + 30 integration. Runtime intake schema enforcement was missing. |
| Runtime intake repair [#29](https://github.com/AaryakPawar/fire-control/pull/29), `82875e9`, merged as `d2e0df7` | 49 passing tests include five provisional runtime intake regressions. Jamal submitted a positive `COMMENTED` review on that PR head before merge. |
| Verification [#30](https://github.com/AaryakPawar/fire-control/pull/30), including the #29 repair | A clean source copy without Git metadata passes `npm ci` / `npm test` on Node 22: 49 tests (10 FireWatch + 4 FireSim + 35 integration). |
| Actual FireWatch compatibility | Still unverified. Passing provisional contract/mock tests does not prove upstream compatibility. |

The verification change unifies the command and CI scope. It includes the
runtime repair from merged PR #29 and does not implement live integration.
The original #30 implementation `db174df` passed 44 tests before that repair was
included. Test totals depend on the checked-out revision. See the PR and main
commit checks for their current CI results.

---

## Motivation / Concept

**FireControl** is Team FireControl's proposed command, planning, and response-coordination subsystem for the larger **Fire Force Six** system-of-systems.

Fire Force Six is a civilian fire-monitoring and firefighting system in which independently developed subsystems cooperate to monitor wildfire conditions, gather operational information, coordinate response decisions, and carry out firefighting actions.

This creates an important coordination problem.

Incident information may be produced by monitoring or reconnaissance components, while response actions may be carried out by separate operational components. A fire-response commander still needs a controlled application through which that information can be reviewed and converted into deliberate, validated, and traceable response actions.

**FireControl addresses this need by providing a human-facing coordination layer.**

The application allows an authorized operator to:

- review available incident and operational information,
- create a structured response plan,
- select response actions,
- identify target areas or zones,
- assign resources where applicable,
- assign priorities,
- validate planned commands,
- explicitly approve the response plan,
- submit approved commands or tasking to the appropriate Fire Force Six subsystem,
- monitor acknowledgments and operational status, and
- preserve a history of significant planning and command events.

FireControl is intentionally designed as a **human-in-the-loop system**. It supports the operator's decision-making rather than autonomously determining the complete wildfire-response strategy.

The application also does not recreate capabilities owned by other Fire Force Six subsystems, such as wildfire detection, drone navigation, autonomous sensing, firefighting mechanisms, or detailed simulation.

---

## Primary Features

### Incident & Situation Intake

FireControl will receive or retrieve available incident and operational information from other Fire Force Six components.

The operator may review information such as:

- incident location or affected zones,
- severity,
- environmental conditions,
- telemetry,
- available resources, and
- operational status.

Invalid, incomplete, or unavailable information will be identified clearly.

### Response Plan Builder

The operator will be able to create and modify a structured response plan for an active incident.

A response plan may include:

- predefined response actions,
- target areas,
- assigned resources,
- command priorities, and
- one or more planned commands.

The operator will be able to add, edit, remove, and review planned actions before approval.

### Plan Validation & Approval

FireControl will validate required command information before submission.

Invalid or incomplete actions will be prevented from being submitted, and clear validation messages will be shown to the operator.

After successful validation, the response plan must receive **explicit operator approval** before any command is transmitted.

### Command Submission

Approved command or tasking information will be sent to the appropriate Fire Force Six subsystem.

Depending on the agreed interface between teams, communication may use:

- asynchronous messaging through **NATS**,
- synchronous **REST APIs**, or
- a combination of both.

FireControl will also handle acknowledgments, rejection responses, communication failures, and appropriate retry scenarios.

### Command Status & Audit History

FireControl will display the latest available operational status of submitted commands.

Possible states may include:

- Submitted
- Accepted
- Rejected
- Running
- Completed
- Failed

The exact shared states will be refined through coordination with the other Fire Force Six teams.

FireControl will also preserve significant events such as:

- plan creation,
- plan modification,
- validation,
- approval,
- command submission,
- acknowledgment,
- failure,
- retry, and
- status changes.

This provides traceability throughout the response lifecycle.

---

## Initial Product Backlog

The FireControl MVP is organized into seven planned Epics.

Together, these Epics cover the complete proposed FireControl workflow.

| # | Epic | Description |
|---:|---|---|
| 1 | [Interface Contracts & Mock Services](https://github.com/AaryakPawar/fire-control/issues/1) | Define integration contracts, communication interfaces, mocks, and test fixtures |
| 2 | [Incident Snapshot Intake](https://github.com/AaryakPawar/fire-control/issues/2) | Receive, validate, and display incident and operational information |
| 3 | [Response Plan Builder](https://github.com/AaryakPawar/fire-control/issues/3) | Create, modify, and review structured response plans |
| 4 | [Plan Validation & Approval](https://github.com/AaryakPawar/fire-control/issues/4) | Validate planned commands and require explicit operator approval |
| 5 | [Command Submission](https://github.com/AaryakPawar/fire-control/issues/5) | Submit approved commands and process acknowledgments, failures, and retries |
| 6 | [Command Status & Audit History](https://github.com/AaryakPawar/fire-control/issues/6) | Track execution state and preserve significant lifecycle events |
| 7 | [Quality, Deployment & Demo Readiness](https://github.com/AaryakPawar/fire-control/issues/7) | Testing, CI/CD, deployment, reproducibility, and demonstration readiness |

**Complete GitHub Issues Backlog:**  
https://github.com/AaryakPawar/fire-control/issues

---

## Proposed application stack and implemented foundations

The contract/mock foundation currently uses JavaScript modules, Node.js's native
test runner, JSON Schema, Ajv/ajv-formats and GitHub Actions. The application UI,
API, database and deployment choices below remain proposed unless specifically
identified as current. Their presence in this table does not imply installation,
a running application, or deployed behavior.

| Area | Technology | Purpose |
|---|---|---|
| Frontend | React + TypeScript | Operator interface, incident view, response-plan workflow, approval, and status display |
| Backend | Node.js + Express + TypeScript | Business rules, validation, APIs, and integration services |
| Database | PostgreSQL + Prisma | Response plans, commands, operational status, and audit history |
| Asynchronous Messaging | NATS | Publish/subscribe communication between Fire Force Six subsystems |
| API / Message Contracts | OpenAPI + JSON Schema | Define and validate REST interfaces and message payloads |
| Unit Testing | Node.js test runner (current); Vitest / Jest (proposed alternatives) | Contract/mock verification now; possible future application tests |
| API Testing | Supertest | Backend/API verification |
| UI / End-to-End Testing | Playwright | End-to-end operator workflow testing |
| Containerization | Docker | Repeatable development and testing environments |
| CI/CD | GitHub Actions | Automated build, test, and quality checks |
| Frontend Deployment | Vercel | Planned frontend deployment |
| Backend Deployment | Render | Planned backend/API deployment |

FireWatch has confirmed full `PerceptionSnapshot` v1.0.0 messages on NATS subject
`firewatch.v1.perceptions`, with its publisher planned for November 22, 2026.
FireControl's `IncidentSnapshot` schema is a provisional internal/mock model.
The proposed Part C subscriber/cache must adapt upstream data; incident identity,
severity and coordinate-to-zone mapping remain unresolved. Actual compatibility
is unverified. FireWatch's `/twin` is an internal/debug endpoint, not an intake
contract, and no latest-snapshot REST endpoint is currently promised. FireSim's
transport and shared execution guarantees remain provisional.

---

## Feasibility

FireControl is designed to be achievable within the **12-week project timeline**.

The project deliberately focuses on one complete end-to-end command-and-control workflow:

**Receive information → Review situation → Build plan → Validate → Approve → Submit command → Receive status → Preserve history**

The MVP does not attempt to implement the internal capabilities of the other Fire Force Six components.

The scope is limited to:

- one active incident context,
- structured incident information,
- predefined response actions,
- response-plan creation,
- explicit human approval,
- external subsystem communication,
- command-status tracking, and
- basic audit history.

External Fire Force Six components can initially be represented using mock publishers, mock services, and replayable fixtures. This allows FireControl development and testing to continue even when another team's subsystem is not yet available.

The integration layer will also isolate FireControl's internal planning logic from external interface changes.

---

### Key Risks and Mitigations

| Risk | Mitigation |
|---|---|
| External interfaces change | Keep external communication behind adapters and update agreed contracts as needed |
| Another Fire Force Six subsystem is unavailable | Use mocks and replayable fixtures |
| Teams interpret message formats differently | Review interfaces regularly with collaborating teams |
| NATS or integration technology requires additional learning | Implement small integration examples early in the project |
| Scope becomes too large | Restrict the MVP to the core FireControl workflow |
| Invalid or incomplete commands | Validate required information and require explicit operator approval |
| Communication failures | Provide error handling, status visibility, and controlled retry behavior |
| Two-person team capacity | Assign clear primary responsibilities while reviewing integration-critical work together |

---

## 12-Week Delivery Plan

| Weeks | Planned Delivery |
|---|---|
| **1–2** | Finalize FireControl concept, repository setup, interface assumptions, technology stack, and mock payloads |
| **3–4** | Incident and operational-information intake and initial operator view |
| **5–6** | Response-plan model and response-plan builder |
| **7–8** | Validation, operator approval, command submission, and acknowledgment handling |
| **9–10** | Status tracking, audit history, contract testing, and integration testing |
| **11–12** | Connect available Fire Force Six subsystems, complete end-to-end testing, deployment, defect resolution, documentation, and final demonstration |

---

## Team Capability & Contribution

### Aaryak Pawar — NUID 002065641

Aaryak has previous experience developing database-backed and multi-role applications using technologies including Java, object-oriented programming, SQLite/JDBC, Apache Ant, and Git/GitHub.

This experience includes application workflow design, domain modeling, persistent data, and collaborative software development.

**Primary Responsibilities:**

- backend development,
- domain and data modeling,
- PostgreSQL and Prisma,
- integration adapters,
- REST API development,
- NATS integration,
- command-processing logic,
- contract and integration testing,
- shared automated testing, and
- CI/CD.

### Jamal Oyeyemi Akinlabi — NUID 001647538

Jamal has a background in Information Systems, GRC/cybersecurity, SIEM application work, and Microsoft Security, Compliance, Identity, and Azure fundamentals.

This experience supports the development of secure workflows, operator-facing functionality, validation, and audit controls.

**Primary Responsibilities:**

- React frontend development,
- operator interface,
- incident and planning workflow,
- response-plan builder,
- validation UX,
- approval workflow,
- command-status presentation,
- security and audit controls, and
- shared integration testing.

### Shared Responsibilities

Both team members will contribute to:

- architecture and design decisions,
- interface-contract discussions,
- coordination with other Fire Force Six teams,
- GitHub backlog refinement,
- Pull Request reviews,
- integration testing,
- documentation, and
- end-to-end demonstrations.

---

## Project Status — Part B baseline

**Current phase:** Part B analysis, architecture, design and documented
contract/mock implementation progress. Status snapshot: October 30, 2026.
These are source and process observations, not overall product completion.

### Implemented integration foundation

PRs #26–#29 are merged. The main baseline after #29, `d2e0df7`, contains the
provisional FireWatch/FireSim schemas, fixtures, mock adapters and runtime
validation of provisional incident snapshots. Malformed intake now throws
structured schema-validation errors at the adapter boundary. The complete
combined verification revision has **49 passing tests** (10 FireWatch, 4 FireSim,
35 integration), including five intake regressions.

[PR #30](https://github.com/AaryakPawar/fire-control/pull/30) supplies this
revision's combined `npm test` command, local-only schema loading and lockfile
installation in CI. Jamal left positive peer discussion on its earlier head
`f133122`; the later update incorporates reviewed #29 and resolves documentation
overlap. PR and main check results remain separately visible on GitHub.

### Remaining work and limits

- Issue #11 remains Open / In Review pending explicit story acceptance and a
  closure decision after merged verification. Its runtime repair is merged.
- Operator UI, plan editing, business validation/approval, durable submission,
  persistence/audit and live integrations remain proposed or backlog work.
- Actual FireWatch and FireSim compatibility remains unverified. Mock behavior
  does not demonstrate deployment or completion of the operator workflow.
- A merge records integration into main. It does not establish missing peer
  review: PR #27 remains merged without recorded review evidence.

### Story acceptance and Scrum state

| Story | State | Acceptance basis / remaining work |
| --- | --- | --- |
| [#11 — FireWatch intake](https://github.com/AaryakPawar/fire-control/issues/11) | Open / In Review | Runtime repair #29 is merged; provisional intake tests pass. Explicit story acceptance and closure remain pending. |
| [#12 — FireSim contracts](https://github.com/AaryakPawar/fire-control/issues/12) | Closed / Done | Acceptance recorded against its six contract-story criteria: request/status definitions, required fields/enums/correlation, identifiable validation errors, valid/invalid fixtures and standalone testing. |
| [#13 — Mock integrations](https://github.com/AaryakPawar/fire-control/issues/13) | Closed / Done | Completed mock foundation via merged #28; interface-neutral demo progression remains follow-up work. |

The current inventory is **7 open epics and 15 stories: 13 open, 2 closed**.
The [Scrum board](https://github.com/users/AaryakPawar/projects/1) contains all
22 epic/story issues: **19 Backlog, 0 Ready, 0 In Progress, 1 In Review, 2 Done**.
Future sprint selection does not move a story out of Backlog or imply completion.
Missing peer review on PR #27 remains a process limitation; external FireSim
compatibility and actual submission/status services are outside #12's contract
story scope.

### Delivery plan recorded October 30

| Milestone | Planning window, 2026 | Stories | Owners |
| --- | --- | --- | --- |
| [Sprint 1 — Contracts & Architecture](https://github.com/AaryakPawar/fire-control/milestone/1) | October 2–30 | #11–#13 | Aaryak |
| [Sprint 2 — Incident UI & Intake](https://github.com/AaryakPawar/fire-control/milestone/2) | October 30–November 6 | #14–#15 | Jamal |
| [Sprint 3 — Plan Builder & Approval](https://github.com/AaryakPawar/fire-control/milestone/3) | November 7–13 | #16–#19 | Jamal: #16–17; Aaryak: #18–19 |
| [Sprint 4 — Submission, Status & Audit](https://github.com/AaryakPawar/fire-control/milestone/4) | November 14–20 | #20–#23 | Aaryak: #20–22; Jamal: #23 |
| [Sprint 5 — Workflow Verification & Demo](https://github.com/AaryakPawar/fire-control/milestone/5) | November 21–28 | #24–#25 | Aaryak: #24; Jamal: #25 |

Each milestone records its goal, dependencies and acceptance evidence. Sprint 1's
end date and the future plan were documented on October 30; no earlier planning
record or historical completion is implied. Live FireWatch adaptation remains
conditional Part C work, with a mock-backed demo fallback if the publisher is
unavailable. Refresh this snapshot before submission if code, review or process
state changes.
