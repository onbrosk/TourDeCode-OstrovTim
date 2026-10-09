const db = require('../db'); // Assumes a MySQL connection pool instance
import { t } from 'elysia';
class MemberModel {
  static async findAll() {
    const [rows] = await db.execute('SELECT id, name, surname FROM members');
    return rows;
  }

  static async findById(id: number) {
    const [rows] = await db.execute(
      'SELECT id, name, surname FROM members WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async create({ name, surname }: { name: string; surname: string }) {
    const [result] = await db.execute(
      'INSERT INTO members (name, surname) VALUES (?, ?)',
      [name, surname]
    );
    return result.insertId;
  }
}

module.exports = MemberModel;