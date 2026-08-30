import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const databasePath = resolve(here, "../data/evidence.json");
const database = JSON.parse(await readFile(databasePath, "utf8"));
const errors = [];
const allowedStrengths = new Set(["high", "moderate", "limited"]);
const idPattern = /^EV-\d{3}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

if (!Array.isArray(database.records)) errors.push("records must be an array");

const records = Array.isArray(database.records) ? database.records : [];
const ids = new Set();

for (const [index, record] of records.entries()) {
  const label = record.id || `row ${index + 1}`;
  if (!idPattern.test(record.id || "")) errors.push(`${label}: invalid ID`);
  if (ids.has(record.id)) errors.push(`${label}: duplicate ID`);
  ids.add(record.id);
  if (!record.title_en) errors.push(`${label}: title_en is required`);
  if (!allowedStrengths.has(record.evidence_strength)) errors.push(`${label}: invalid evidence_strength`);
  if (!datePattern.test(record.date_added || "")) errors.push(`${label}: invalid date_added`);
  if (!datePattern.test(record.last_verified || "")) errors.push(`${label}: invalid last_verified`);
  try {
    const url = new URL(record.source_url);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('bad protocol');
  } catch {
    errors.push(`${label}: invalid source_url`);
  }
  for (const field of ["authors", "nutrition_topics", "outcomes", "population", "sports", "training_context", "safety_admin_flags"]) {
    if (!Array.isArray(record[field])) errors.push(`${label}: ${field} must be an array`);
  }
}

if (database.metadata?.record_count !== records.length) {
  errors.push(`metadata.record_count is ${database.metadata?.record_count}; expected ${records.length}`);
}

if (errors.length) {
  console.error(`Evidence validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Evidence validation passed: ${records.length} unique records.`);

