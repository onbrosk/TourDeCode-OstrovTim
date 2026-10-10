import { cors } from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { sql } from "./db.js";
import { membersPlugin } from "./members/index.js";
import { teamsPlugin } from "./teams/index.js";
import { runMigrations } from "./migrate.js";

for (let attempt = 1; ; attempt++) {
  try {
    await runMigrations();
    break;

  } catch (error) {
    if (attempt === 60) throw error;
    console.log("Waiting for database...");
    await Bun.sleep(1000);
  }
}

const app = new Elysia({ prefix: "/api" })
  .use(cors())
  .use(membersPlugin)
  .use(teamsPlugin)
  .listen({ hostname: "0.0.0.0", port: Number(process.env.PORT ?? 3001) });

console.log(
  `Server running on http://${app.server?.hostname}:${app.server?.port}`,
);
