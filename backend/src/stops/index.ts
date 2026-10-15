import { join } from "node:path";
import { Elysia } from "elysia";
import { StopModel } from "./model";
import { StopService } from "./service";

const imagesDir = join(import.meta.dir, "..", "data", "stopsImages");

export const stopsPlugin = new Elysia({ prefix: "/stops" })
  .model(StopModel)
  .get("/", async () => StopService.getAll())
  .post("/", async ({ body, status }) => status(201, await StopService.create(body)), {
    body: "stopInput",
  })
  .get(
    "/:id",
    async ({ params: { id }, status }) => {
      try {
        return await StopService.getById(id);
      } catch (err: any) {
        return status(404, { message: err.message });
      }
    },
    { params: "params" },
  )
  .put(
    "/:id",
    async ({ params: { id }, body, status }) => {
      try {
        return await StopService.update(id, body);
      } catch (err: any) {
        return status(404, { message: err.message });
      }
    },
    { params: "params", body: "stopInput" },
  )
  .delete(
    "/:id",
    async ({ params: { id }, status }) => {
      try {
        await StopService.delete(id);
        return status(204);
      } catch (err: any) {
        return status(404, { message: err.message });
      }
    },
    { params: "params" },
  )
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
