---
name: kysely-migration-generator
description: Use when asked to turn a Mermaid ERD (.mmd or .svg in docs/architecture/) into a Kysely database migration. Generates a type-safe TypeScript migration in src/db/migrations/.
---

# Kysely Migration Generator

# Translation Rules
- - Convert Mermaid entity names to `snake_case` table names (for example, `USERS` becomes `users`) and attribute names to `snake_case` column names.
- For PK, match the ID type in `001_initial_schema.ts` (`serial` with `.primaryKey()`).
- For FK, use `integer` (never `serial`) for FK columns that reference a `serial` PK. Write them as `.notNull().references('table.id').onDelete('cascade')` unless the ERD marks the relationship optional. If a relationship implies an FK the ERD omits, add the FK column on the referencing side.
- **`||--o{` means one-to-many; FK on the `o{` side, no unique constraint.
- **`||--o|` means one-to-one; FK on the `o|` side with `.unique()`.
- **`}o--o{` means many-to-many; create a junction table with two FKs (both `onDelete('cascade')`) and a composite primary key.
- For existing tables, be sure to never recreate, drop, rename, or alter them. Reference them in FKs only.

## Migration Output

- Write to `src/db/migrations/<YYYYMMDDHHMMSS>_<snake_case_name>.ts`.
- Start with `import { Kysely, sql } from 'kysely';` and export `async function up(db: Kysely<any>): Promise<void>` and `async function down(db: Kysely<any>): Promise<void>`.
- In `up`, create parent tables before dependent tables, and call `.execute()` on every statement.
- In `down`, drop only tables created by this migration, in exact reverse dependency order.
- After writing, run `npm run build` and fix any errors. Then run `npm run migrate:up`. If the database is unavailable, report that execution was not verified and include the error. Never claim success without running it.