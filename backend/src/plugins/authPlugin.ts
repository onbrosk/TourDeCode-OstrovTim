import { bearer } from "@elysia/bearer";
import { jwt } from "@elysia/jwt";
import { Elysia } from "elysia";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET must be set to use the auth plugin");
}

export const authPlugin = new Elysia({ name: "auth" })
  .use(bearer())
  .use(jwt({ name: "jwt", secret: jwtSecret }))
  .derive(async ({ bearer, jwt }) => ({
    user: bearer ? await jwt.verify(bearer) : null,
  }))
  .onBeforeHandle(({ user, set, status }) => {
    if (!user) {
      set.headers["WWW-Authenticate"] = 'Bearer realm="api"';
      return status(401, { error: "Unauthorized" });
    }
  })
  .as("scoped");
