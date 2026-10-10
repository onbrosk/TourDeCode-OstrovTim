import { sql } from "../db.js";

export class TeamService {
  static async getAll() {
    return await sql`SELECT id, name FROM teams`;
  }

  static async getById(id: number) {
    const [team] = await sql.begin(async (db) =>
      db`SELECT id, name FROM teams WHERE id = ${id}`
    );

    if (!team) {
      throw new Error("Team not found");
    }

    return team;
  }

  static async create(data: { name: string }) {
    const [team] = await sql.begin(async (db) => {
      await db`INSERT INTO teams (name) VALUES (${data.name})`;
      return db`SELECT id, name FROM teams WHERE id = LAST_INSERT_ID()`;
    });

    if (!team) {
      throw new Error("Inserted team could not be retrieved");
    }

    return team;
  }
}
