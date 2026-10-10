import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { sql } from "./db.js";

const migrationsDir = join(import.meta.dir, "migrations");

export async function runMigrations() {
  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (
    name VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const rows = await sql`SELECT name FROM schema_migrations`;
  const applied = new Set(rows.map((r: { name: string }) => r.name));

  for (const file of files) {
    if (applied.has(file)) continue;

    const content = await Bun.file(join(migrationsDir, file)).text();
    const statements = content
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await sql.unsafe(statement);
    }

    await sql`INSERT INTO schema_migrations (name) VALUES (${file})`;
    console.log(`[migrate] Applied ${file}`);
  }
}