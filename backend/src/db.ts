import mysql from 'mysql2/promise'

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

  console.log('[MySQL]: Members and teams tables are ready.')
}



export default pool