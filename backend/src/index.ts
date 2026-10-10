import { cors } from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { SQL } from "bun";

const sql = new SQL(process.env.DATABASE_URL!, {
  allowPublicKeyRetrieval: true,
});

for (let attempt = 1; ; attempt++) {
  try {
    await sql`CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL
    )`;

    await sql`CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
    )`;

    break;

  } catch (error) {
    if (attempt === 60) throw error;
    console.log("Waiting for database...");
    await Bun.sleep(1000);
  }
}

const ProductBody = t.Object({ name: t.String(), cost: t.Integer() });

const app = new Elysia({ prefix: "/api" })
  .use(cors())  
  .listen({ hostname: "0.0.0.0", port: Number(process.env.PORT ?? 3001) });

console.log(
  `Server running on http://${app.server?.hostname}:${app.server?.port}`,
);
