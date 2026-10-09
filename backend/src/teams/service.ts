import db from '../db'
export class Teamservice {
  static async getAll() {
    const [rows] = await db.execute('SELECT id, name FROM teams')
    return rows
  }

  static async getById(id: number) {
    const [rows] = await db.execute(
      'SELECT id, name FROM teams WHERE id = ?',
      [id]
    )
    const teams = rows as any[]
    if (!teams.length) {
      throw new Error('Member not found')
    }
    return teams[0]
  }

  static async create(data: { name: string }) {
    const [result] = await db.execute(
      'INSERT INTO teams (name) VALUES (?)',
      [data.name]
    )
    const insertId = (result as any).insertId
    return this.getById(insertId)
  }
}