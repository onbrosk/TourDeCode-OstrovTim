import { timingSafeEqual } from "node:crypto";

const ADMIN_KEY =
  process.env.ADMIN_API_KEY ?? "Kyqc49jIM+5+D0Sed8ZQ671gxkd7W/bBTWjDtZ0Zrgk=";

export function isAuthorised(request: Request): boolean {
  const header = request.headers.get("authorization");
  if (!header) return false;

  const match = header.match(/^Bearer\s+(\S+)\s*$/i);
  if (!match) return false;

  const given = Buffer.from(match[1]);
  const expected = Buffer.from(ADMIN_KEY);
  return given.length === expected.length && timingSafeEqual(given, expected);
}