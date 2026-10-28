import { join } from "node:path";
import { Elysia, t } from "elysia";
import { isAuthorised } from "../plugins/authPlugin.js";
import { StopModel } from "./model";
import { StopNotFoundError, StopService } from "./service";

const imagesDir = join(import.meta.dir, "..", "data", "stopsImages");
const stopInputFields = new Set([
  "name",
  "image_url",
  "wheelchair_accessible",
  "has_shelter",
  "has_ticket_machine",
]);
export const stopsPlugin = new Elysia({ prefix: "/stops" })
  .model(StopModel)
  .onRequest(({ request, set }) => {
    const path = new URL(request.url).pathname;

    if (
      ["POST", "PUT", "DELETE"].includes(request.method) &&
      /\/stops(?:\/[^/]+)?\/?$/.test(path) &&
      !isAuthorised(request)
    ) {
      set.status = 401;
      set.headers["WWW-Authenticate"] = 'Bearer realm="api"';
      return { error: "Unauthorized" };
    }

    if (!["GET", "PUT", "DELETE"].includes(request.method)) return;

    const match = path.match(/(?:^|\/)stops\/([^/]+)\/?$/);
    if (!match) return;

    const rawId = match[1];
    const id = Number(rawId);
    if (!/^\d+$/.test(rawId) || !Number.isSafeInteger(id) || id < 1) {
      set.status = 400;
      return { error: "Invalid stop ID" };
    }
  })
  .onParse(({ request, contentType }) => {
    if (
      (request.method === "POST" || request.method === "PUT") &&
      contentType === "application/json" &&
      /(?:^|\/)stops(?:\/\d+)?\/?$/.test(new URL(request.url).pathname)
    ) {
      return request.json().then((body: unknown) => {
        if (
          typeof body === "object" &&
          body !== null &&
          !Array.isArray(body) &&
          Object.keys(body).some((field) => !stopInputFields.has(field))
        ) {
          return null;
        }
        return body;
      });
    }
  })
  .onError(({ code, error, status }) => {
    if (code === "VALIDATION") {
      return status(400, {
        error: String(error.messageValue?.message ?? "Invalid request"),
      });
    }
  })
  .get("/", async () => StopService.getAll(), {
    response: { 200: t.Array(StopModel.stopResponse) },
  })
  .get(
    "/:id",
    async ({ params: { id }, status }) => {
      try {
        return await StopService.getById(id);
      } catch (error) {
        if (error instanceof StopNotFoundError) {
          return status(404, { error: error.message });
        }
        throw error;
      }
    },
    {
      params: "params",
      response: {
        200: StopModel.stopResponse,
        400: StopModel.error,
        404: StopModel.error,
      },
    },
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
  })
  .put(
    "/:id",
    async ({ params: { id }, body, status }) => {
      try {
        return await StopService.update(id, body);
      } catch (error) {
        if (error instanceof StopNotFoundError) {
          return status(404, { error: error.message });
        }
        throw error;
      }
    },
    {
      params: "params",
      body: "stopInput",
      response: {
        200: StopModel.stopResponse,
        400: StopModel.error,
        401: StopModel.error,
        404: StopModel.error,
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, status }) => {
      try {
        await StopService.delete(id);
        return new Response(null, { status: 204 });
      } catch (error) {
        if (error instanceof StopNotFoundError) {
          return status(404, { error: error.message });
        }
        throw error;
      }
    },
    {
      params: "params",
      response: {
        204: t.Void(),
        400: StopModel.error,
        401: StopModel.error,
        404: StopModel.error,
      },
    },
  )
  .post(
    "/",
    async ({ body, status }) =>
      status(201, await StopService.create(body)),
    {
      body: "stopInput",
      response: {
        201: StopModel.stopResponse,
        400: StopModel.error,
        401: StopModel.error,
      },
    },
  );