import { join } from "node:path";
import { sql } from "./db.js";

type Stop = {
  id: number;
  name: string;
  lines: string;
  isTransfer: boolean;
  transferLines: string | null;
  x: number | null;
  y: number | null;
  wheelchairAccessible: boolean;
  hasShelter: boolean;
  hasBench: boolean;
  hasTicketMachine: boolean;
  hasDisplay: boolean;
  imageUrl: string | null;
};

const csvPath = join(import.meta.dir, "data", "stops.csv");
const expectedHeaders = [
  "id",
  "name",
  "lines",
  "is_transfer",
  "transfer_lines",
  "x",
  "y",
  "wheelchair_accessible",
  "has_shelter",
  "has_bench",
  "has_ticket_machine",
  "has_display",
  "image_url",
];

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < line.length; index++) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        field += '"';
        index++;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      fields.push(field);
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) {
    throw new Error("Invalid stops.csv: unterminated quoted field");
  }

  fields.push(field);
  return fields;
}

function parseBoolean(value: string, field: string, row: number): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid stops.csv row ${row}: ${field} must be true or false`);
}

function parseNumber(value: string, field: string, row: number): number | null {
  if (value === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid stops.csv row ${row}: ${field} must be numeric`);
  }
  return parsed;
}

function parseStops(content: string): Stop[] {
  const lines = content.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines.shift() ?? "");
  if (
    headers.length !== expectedHeaders.length ||
    headers.some((header, index) => header !== expectedHeaders[index])
  ) {
    throw new Error("Invalid stops.csv: unexpected columns");
  }

  return lines.map((line, index) => {
    const rowNumber = index + 2;
    const fields = parseCsvLine(line);
    if (fields.length !== expectedHeaders.length) {
      throw new Error(
        `Invalid stops.csv row ${rowNumber}: expected ${expectedHeaders.length} fields, got ${fields.length}`,
      );
    }

    const [id, name, routes, transfer, transferRoutes, x, y, wheelchair, shelter, bench, ticketMachine, display, image] =
      fields;
    const parsedId = Number(id);
    if (!Number.isSafeInteger(parsedId) || parsedId <= 0 || name.length === 0) {
      throw new Error(`Invalid stops.csv row ${rowNumber}: invalid id or name`);
    }

    return {
      id: parsedId,
      name,
      lines: routes,
      isTransfer: parseBoolean(transfer, "is_transfer", rowNumber),
      transferLines: transferRoutes || null,
      x: parseNumber(x, "x", rowNumber),
      y: parseNumber(y, "y", rowNumber),
      wheelchairAccessible: parseBoolean(wheelchair, "wheelchair_accessible", rowNumber),
      hasShelter: parseBoolean(shelter, "has_shelter", rowNumber),
      hasBench: parseBoolean(bench, "has_bench", rowNumber),
      hasTicketMachine: parseBoolean(ticketMachine, "has_ticket_machine", rowNumber),
      hasDisplay: parseBoolean(display, "has_display", rowNumber),
      imageUrl: image || null,
    };
  });
}

export async function seedStops() {
  const content = await Bun.file(csvPath).text();
  const stops = parseStops(content);
  if (stops.length === 0) {
    throw new Error("Invalid stops.csv: no stops found");
  }

  for (const stop of stops) {
    await sql`
      INSERT INTO stops (
        id, name, \`lines\`, is_transfer, transfer_lines, x, y,
        wheelchair_accessible, has_shelter, has_bench,
        has_ticket_machine, has_display, image_url
      ) VALUES (
        ${stop.id}, ${stop.name}, ${stop.lines}, ${stop.isTransfer},
        ${stop.transferLines}, ${stop.x}, ${stop.y},
        ${stop.wheelchairAccessible}, ${stop.hasShelter}, ${stop.hasBench},
        ${stop.hasTicketMachine}, ${stop.hasDisplay}, ${stop.imageUrl}
      )
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        \`lines\` = VALUES(\`lines\`),
        is_transfer = VALUES(is_transfer),
        transfer_lines = VALUES(transfer_lines),
        x = VALUES(x),
        y = VALUES(y),
        wheelchair_accessible = VALUES(wheelchair_accessible),
        has_shelter = VALUES(has_shelter),
        has_bench = VALUES(has_bench),
        has_ticket_machine = VALUES(has_ticket_machine),
        has_display = VALUES(has_display),
        image_url = VALUES(image_url)
    `;
  }

  console.log(`[seed] Loaded ${stops.length} stops from ${csvPath}`);
}
