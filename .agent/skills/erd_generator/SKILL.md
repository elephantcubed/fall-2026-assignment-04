---
name: erd-generator
description: Design an ERD, data model, database schema diagram, or architecture diagram from a domain description. Make sure to draft a Mermaid erDiagram, validate it, and render an SVG.
---

# ERD Generator

## Workflow
1. Parse domain requirements into entities, primary keys (PK), foreign keys (FK), and cardinalities.
2. Write the drafted Mermaid syntax directly to docs/architecture/schema.mmd.
3. Execute node scripts/render_erd.js docs/architecture/schema.mmd.
4. Self-Correction Loop: If execution fails with SYNTAX_ERROR, parse the error trace, adjust the Mermaid syntax in docs/architecture/schema.mmd, and re-run (up to 3 retries).
5. Final Output: Present the raw Mermaid block to the user and reference the generated image asset path (docs/architecture/erd.svg).