import db from '../db'
export class MemberService {
  static async getAll() {
    const [rows] = await db.execute('SELECT id, name, surname FROM members')
    return rows
  }

  static async getById(id: number) {
    const [rows] = await db.execute(
      'SELECT id, name, surname FROM members WHERE id = ?',
      [id]
    )
    const members = rows as any[]
    if (!members.length) {
      throw new Error('Member not found')
    }
    return members[0]
  }

  static async create(data: { name: string; surname: string }) {
    const [result] = await db.execute(
      'INSERT INTO members (name, surname) VALUES (?, ?)',
      [data.name, data.surname]
    )
    const insertId = (result as any).insertId
    return this.getById(insertId)
  }
}