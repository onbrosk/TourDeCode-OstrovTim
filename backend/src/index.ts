import { cors } from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { SQL } from "bun";

type Product = { id: number; name: string; cost: number };

// DATABASE_URL, e.g. mysql://tda_user:strongPassword%3F@127.0.0.1:3306/product
// allowPublicKeyRetrieval: MySQL 8 password auth over plain TCP; safe because the DB is on the pod's localhost.
const sql = new SQL(process.env.DATABASE_URL!, { allowPublicKeyRetrieval: true });

// The database may still be starting up (no startup order on Tour de Cloud), so retry.
for (let attempt = 1; ; attempt++) {
  try {
    await sql`CREATE TABLE IF NOT EXISTS product (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      cost INT NOT NULL
    )`;
    break;
  } catch (error) {
    if (attempt === 60) throw error;
    console.log("Waiting for database...");
    await Bun.sleep(1000);
  }
}

const ProductBody = t.Object({ name: t.String(), cost: t.Integer() });

// Allow a frontend dev server on another port (e.g. localhost:3000) to call the API.
//
// Bun's SQL query results are a `SQLResultArray` subclass, not a plain Array —
// Elysia's response pipeline silently drops the cors() plugin's headers when a
// handler returns one directly (same-origin prod, behind Caddy, never notices).
// Spread into a plain array/object before returning.
const app = new Elysia({ prefix: "/api/v1" })
  .use(cors())
  .get("/heatlh", () => ({ status: "ok" }))
  .listen({ hostname: "0.0.0.0", port: Number(process.env.PORT ?? 3001) });

console.log(`Server running on http://${app.server?.hostname}:${app.server?.port}`);
