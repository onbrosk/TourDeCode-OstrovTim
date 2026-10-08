import { cors } from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { SQL } from "bun";

type Product = { id: number; name: string; cost: number };

// DATABASE_URL, e.g. mysql://tda_user:strongPassword%3F@127.0.0.1:3306/product
// allowPublicKeyRetrieval: MySQL 8 password auth over plain TCP; safe because the DB is on the pod's localhost.
const sql = new SQL(process.env.DATABASE_URL!, { allowPublicKeyRetrieval: true });

let databaseInitializationFailed = false;
const databaseInitialization = (async () => {
  for (let attempt = 1; ; attempt++) {
    try {
      await sql`CREATE TABLE IF NOT EXISTS product (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        cost INT NOT NULL
      )`;
      return;
    } catch (error) {
      if (attempt === 60) throw error;
      console.log("Waiting for database...");
      await Bun.sleep(1000);
    }
  }
})().catch((error: unknown) => {
  databaseInitializationFailed = true;
  console.error("Database initialization failed:", error);
});

const ProductBody = t.Object({ name: t.String(), cost: t.Integer() });

// Allow a frontend dev server on another port (e.g. localhost:3000) to call the API.
//
// Bun's SQL query results are a `SQLResultArray` subclass, not a plain Array —
// Elysia's response pipeline silently drops the cors() plugin's headers when a
// handler returns one directly (same-origin prod, behind Caddy, never notices).
// Spread into a plain array/object before returning.
const app = new Elysia()
  .use(cors())
  .get("/api/v1/health", () => ({ status: "ok" }))
  .group("/api/product", (app) =>
    app
      .onBeforeHandle(async ({ set }) => {
        await databaseInitialization;
        if (databaseInitializationFailed) {
          set.status = 503;
          return { message: "Database unavailable" };
        }
      })
      .get("/", async () => [...(await sql<Product[]>`SELECT id, name, cost FROM product ORDER BY id`)])
      .post(
        "/",
        async ({ body }) => {
          const result = await sql`INSERT INTO product (name, cost) VALUES (${body.name}, ${body.cost})`;
          return { id: Number(result.lastInsertRowid), ...body };
        },
        { body: ProductBody },
      )
      .put(
        "/:id",
        async ({ params: { id }, body, status }) => {
          const [product] = [...(await sql<Product[]>`SELECT id FROM product WHERE id = ${id}`)];
          if (!product) return status(404, { message: "Product does not exist" });

          await sql`UPDATE product SET name = ${body.name}, cost = ${body.cost} WHERE id = ${id}`;
          return { id, ...body };
        },
        { params: t.Object({ id: t.Numeric() }), body: ProductBody },
      )
      .delete(
        "/:id",
        async ({ params: { id } }) => {
          await sql`DELETE FROM product WHERE id = ${id}`;
          return { message: "Product was deleted permanently from DB." };
        },
        { params: t.Object({ id: t.Numeric() }) },
      ),
  )
  .listen({ hostname: "0.0.0.0", port: Number(process.env.PORT ?? 3001) });

console.log(`Server running on http://${app.server?.hostname}:${app.server?.port}`);
