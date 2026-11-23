const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.', 'data', 'forum.db')

const db = new Database(dbPath);

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    )`);

db.exec(
    `
        CREATE TABLE IF OT EXISTS threads (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `
)

db.exec(
    `
        CREATE TABLE IF NOT EXISTS replies (
        id INTEGER PRIMARY KEY,
        thread_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        body TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (threads_id) REFERENCES threads(id) ON DELETE CASCADE,
        FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `
)

module.exports = db;