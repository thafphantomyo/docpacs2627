const db = require('../models/database')
const createTableSQL=`CREATE TABLE  IF NOT EXISTS schema_migrations (
    migration_name TEXT NOT NULL PRIMARY KEY,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP)`;
db.exec(createTableSQL);
console.log('Intialization complete');
db.close();