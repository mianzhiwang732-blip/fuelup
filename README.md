# FuelUp

FuelUp is an evidence-based sports nutrition project for student athletes. The repository now includes a version-controlled evidence database that can be reviewed, searched, and used directly by the GitHub Pages website.

## Evidence database

- `data/evidence.json` — website-ready database with array-valued tags
- `data/evidence.csv` — flat export for spreadsheet analysis
- `data/evidence.schema.json` — machine-readable field contract
- `evidence-library.html` — searchable public evidence library
- `scripts/validate-evidence.mjs` — dependency-free data quality checks

Run the validator with Node.js 18 or later:

```bash
node scripts/validate-evidence.mjs
```

Each evidence record includes a stable `EV-###` ID, English and Chinese titles, authors, publication year, evidence strength, applicability, study type, population, nutrition topics, sports, safety flags, DOI, and source URL.

## Updating the database

1. Add or edit a record in both `data/evidence.json` and `data/evidence.csv`.
2. Keep IDs unique and never recycle an existing ID.
3. Update `metadata.record_count` and `metadata.last_updated` in the JSON file.
4. Run `node scripts/validate-evidence.mjs`.
5. Submit the change through a pull request so the evidence trail remains reviewable.

## Safety

This database is an educational evidence index, not medical or dietetic advice. Evidence derived mainly from adults is explicitly flagged when it may be applied to minors. Safety and administrative flags should be reviewed before any record is used to generate athlete-facing guidance.

