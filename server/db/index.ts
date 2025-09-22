import Database from 'better-sqlite3'

const db = new Database('./data/socialverse.db')

// Example: get all settings
export function getSettings(scope: string) {
  return db.prepare('SELECT key, value FROM settings WHERE scope = ?').all(scope)
}

// Example: save or update a setting
export function saveSetting(scope: string, key: string, value: string) {
  db.prepare(`
    INSERT INTO settings (scope, key, value)
    VALUES (?, ?, ?)
    ON CONFLICT(key, scope) DO UPDATE SET value = excluded.value
  `).run(scope, key, value)
}
