import { timingSafeEqual } from "node:crypto";

const ADMIN_KEY = process.env.ADMIN_API_KEY;

if (!ADMIN_KEY?.trim()) {
  throw new Error("ADMIN_API_KEY must be configured");
}

export function isAuthorised(request: Request): boolean {
  const header = request.headers.get("authorization");
  if (!header) return false;

  const match = header.match(/^Bearer\s+(\S+)\s*$/i);
  if (!match) return false;

  const given = Buffer.from(match[1]);
  const expected = Buffer.from(ADMIN_KEY);
  return given.length === expected.length && timingSafeEqual(given, expected);
}