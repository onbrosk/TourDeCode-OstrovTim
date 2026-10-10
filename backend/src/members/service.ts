import { sql } from "../db.js";
export class MemberService {
  static async getAll() {
    return await sql`SELECT id, name, surname FROM members`
  }

  static async getById(id: number) {
    const [member] = await sql.begin(async (db) =>
      db`SELECT id, name, surname FROM members WHERE id = ${id}`
    )
    if (!member) {
      throw new Error('Member not found')
    }
    return member
  }

  static async create(data: { name: string; surname: string }) {
    const [member] = await sql.begin(async (db) => {
      await db`INSERT INTO members (name, surname) VALUES (${data.name}, ${data.surname})`
      return db`SELECT id, name, surname FROM members WHERE id = LAST_INSERT_ID()`
    })
    if (!member) {
      throw new Error('Inserted member could not be retrieved')
    }
    return member
  }
}