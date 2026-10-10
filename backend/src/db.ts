import mysql from 'mysql2/promise'
import type { RowDataPacket } from 'mysql2/promise'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not defined')
}

const pool = mysql.createPool({
  uri: databaseUrl,
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true
})

function isConnectionRefused(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error &&
    (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND')
}

export async function cleanDb() {
  try {
    await pool.query('DROP TABLE IF EXISTS members')
    await pool.query('DROP TABLE IF EXISTS teams')
    console.log('[MySQL]: Database cleaned.')
  } catch (error) {
    console.error('[MySQL Cleaning Error]:', error)
  }
}

export async function initDb() {
  const maxAttempts = 30
  const retryDelayMs = 1000

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS members (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          surname VARCHAR(255) NOT NULL UNIQUE
        )
      `)

      await pool.query(`
        CREATE TABLE IF NOT EXISTS teams (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        )
      `)

      const [teamRows] = await pool.query<RowDataPacket[]>('SELECT id FROM teams LIMIT 1')
      if (teamRows.length === 0) {
        await pool.query('INSERT INTO teams (name) VALUES (?)', ['Ostrov Tim'])
      }

      await pool.query(
        'INSERT IGNORE INTO members (name, surname) VALUES (?, ?), (?, ?), (?, ?)',
        [
          'Kristián', 'Kurimský',
          'Lucia', 'Dugasová',
          'Moussa', 'Rehahla',
        ],
      )

      console.log('[MySQL]: Members and teams tables are ready.')
      return
    } catch (error) {
      if (!isConnectionRefused(error) || attempt === maxAttempts) {
        throw error
      }

      console.warn(`[MySQL]: Connection refused; retrying (${attempt}/${maxAttempts}).`)
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs))
    }
  }
}



export default pool