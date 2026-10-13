import { join } from "node:path";
import { Elysia } from "elysia";
import { sql } from "../db.js";

const imagesDir = join(import.meta.dir, "..", "data", "stopsImages");

export const stopsPlugin = new Elysia({ prefix: "/stops" })
  .get("/", async () => {
    return await sql`SELECT * FROM stops ORDER BY id`;
  })
  .get("/images/:filename", async ({ params: { filename }, status }) => {
    if (!/^[A-Za-z0-9]+\.png$/.test(filename)) {
      return status(404, { message: "Stop image not found" });
    }

    const image = Bun.file(join(imagesDir, filename));
    if (!(await image.exists())) {
      return status(404, { message: "Stop image not found" });
    }

    return new Response(image, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  });
