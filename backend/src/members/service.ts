import { sql } from "../db.js";
export class MemberService {
  static async getAll() {
    return await sql`SELECT id, name, surname FROM members`
  }

  static async getById(id: number) {
    const [rows] = await sql.begin( async (db) =>
      await db`SELECT id, name, surname FROM members WHERE id = ${id}`
    )
    const members = rows as any[]
    if (!members.length) {
      throw new Error('Member not found')
    }
    return members[0]
  }

  static async create(data: { name: string; surname: string }) {
    const [result] = await sql.begin( async (db) =>
      await db`INSERT INTO members (name, surname) VALUES (${data.name}, ${data.surname})`
    )
    const insertId = (result as any).insertId
    return this.getById(insertId)
  }
}