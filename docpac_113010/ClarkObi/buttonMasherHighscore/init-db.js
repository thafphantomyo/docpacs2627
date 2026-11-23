const db= require('./data/scores.db', {verbose:console});
const scores=`CREATE TABLE IF NOT EXISTS score (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL)`
db.prepare(scores).run();
console.log('Table made successfully');
