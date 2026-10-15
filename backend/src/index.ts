import { cors } from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { sql } from "./db.js";
import { membersPlugin } from "./members/index.js";
import { teamsPlugin } from "./teams/index.js";
import { stopsPlugin } from "./stops/index.js";
import { runMigrations } from "./migrate.js";
import { seedStops } from "./seedStops.js";

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

await seedStops();

const app = new Elysia({ prefix: "/api/v1" })
  .use(cors())
  .use(membersPlugin)
  .use(teamsPlugin)
  .use(stopsPlugin)
  .listen({ hostname: "0.0.0.0", port: Number(process.env.PORT ?? 3001) });

console.log(
  `Server running on http://${app.server?.hostname}:${app.server?.port}`,
);
