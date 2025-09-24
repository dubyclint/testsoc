import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = path.resolve(process.env.SQLITE_DB_PATH || './data/socialverse.db')
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    scope TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    PRIMARY KEY (scope, key)
  );
`)

console.log('✅ SQLite migration complete.')
