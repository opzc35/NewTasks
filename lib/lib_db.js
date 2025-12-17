const sqlite3 = require('sqlite3');
const open = require('sqlite').open;

async function createDB() {
    const db = await open({
        filename: './data.db',
        driver: sqlite3.Database
    });
    return db;
}

async function initDB() {
    const db = await createDB();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT
        );
    `);
    return db;
}

module.exports = { initDB };