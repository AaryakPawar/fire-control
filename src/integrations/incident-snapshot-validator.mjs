import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const schema = JSON.parse(readFileSync(
  new URL("../../contracts/firewatch/incident-snapshot.schema.json", import.meta.url),
  "utf8"
));
const validate = ajv.compile(schema);

export class IncidentSnapshotValidationError extends Error {
  constructor(errors) {
    super("Invalid FireWatch IncidentSnapshot");
    this.name = "IncidentSnapshotValidationError";
    this.code = "INVALID_INCIDENT_SNAPSHOT";
    this.errors = structuredClone(errors);
  }
}

export function validateIncidentSnapshot(snapshot) {
  if (!validate(snapshot)) {
    throw new IncidentSnapshotValidationError(validate.errors);
  }
  return snapshot;
}
