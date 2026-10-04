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

## Technology Stack

| Area | Technology | Purpose |
|---|---|---|
| Frontend | React + TypeScript | Operator interface, incident view, response-plan workflow, approval, and status display |
| Backend | Node.js + Express + TypeScript | Business rules, validation, APIs, and integration services |
| Database | PostgreSQL + Prisma | Response plans, commands, operational status, and audit history |
| Asynchronous Messaging | NATS | Publish/subscribe communication between Fire Force Six subsystems |
| API / Message Contracts | OpenAPI + JSON Schema | Define and validate REST interfaces and message payloads |
| Unit Testing | Vitest / Jest | Unit-level verification |
| API Testing | Supertest | Backend/API verification |
| UI / End-to-End Testing | Playwright | End-to-end operator workflow testing |
| Containerization | Docker | Repeatable development and testing environments |
| CI/CD | GitHub Actions | Automated build, test, and quality checks |
| Frontend Deployment | Vercel | Planned frontend deployment |
| Backend Deployment | Render | Planned backend/API deployment |

The exact external message formats, NATS topics, REST interfaces, and shared status models may be refined as the Fire Force Six teams coordinate their integration requirements.

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

## Project Status

**Current Phase:** Part A — Concept Proposal & Initial Backlog

### Completed

- FireControl concept finalized
- primary user and unmet need identified
- MVP scope defined
- technology stack proposed
- integration approach identified
- feasibility analyzed
- team responsibilities defined
- seven GitHub Epics created
- high-level user stories added to each Epic

### Next Phase

Implementation and backlog refinement will continue through subsequent project phases as Fire Force Six subsystem interfaces are coordinated across teams.
