import { sql } from "../db.js";

type StopInput = {
  name: string;
  image_url?: string | null;
  wheelchair_accessible: boolean;
  has_shelter: boolean;
  has_ticket_machine: boolean;
};

export class StopService {
  static async getAll() {
    return await sql`SELECT id, name, image_url, wheelchair_accessible, has_shelter, has_ticket_machine FROM stops ORDER BY id`;
  }

  static async getById(id: number) {
    const [stop] = await sql`SELECT id, name, image_url, wheelchair_accessible, has_shelter, has_ticket_machine FROM stops WHERE id = ${id}`;
    if (!stop) throw new Error("Stop not found");
    return stop;
  }

  static async create(data: StopInput) {
    const [stop] = await sql.begin(async (db) => {
      await db`
        INSERT INTO stops (name, image_url, wheelchair_accessible, has_shelter, has_ticket_machine)
        VALUES (${data.name}, ${data.image_url ?? null}, ${data.wheelchair_accessible}, ${data.has_shelter}, ${data.has_ticket_machine})
      `;
      return db`SELECT id, name, image_url, wheelchair_accessible, has_shelter, has_ticket_machine FROM stops WHERE id = LAST_INSERT_ID()`;
    });
    if (!stop) throw new Error("Inserted stop could not be retrieved");
    return stop;
  }

  static async update(id: number, data: StopInput) {
    const [stop] = await sql.begin(async (db) => {
      const result = await db`
        UPDATE stops SET name = ${data.name}, image_url = ${data.image_url ?? null},
          wheelchair_accessible = ${data.wheelchair_accessible}, has_shelter = ${data.has_shelter},
          has_ticket_machine = ${data.has_ticket_machine}
        WHERE id = ${id}
      `;
      if (result.affectedRows === 0) {
        const [existing] = await db`SELECT id FROM stops WHERE id = ${id}`;
        if (!existing) throw new Error("Stop not found");
      }
      return db`SELECT id, name, image_url, wheelchair_accessible, has_shelter, has_ticket_machine FROM stops WHERE id = ${id}`;
    });
    if (!stop) throw new Error("Stop not found");
    return stop;
  }

  static async delete(id: number) {
    const result = await sql`DELETE FROM stops WHERE id = ${id}`;
    if (result.affectedRows === 0) throw new Error("Stop not found");
  }
}
