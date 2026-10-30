const express = require('express');
const app = express();
const db = require('./database');

app.use(express.static('public'));

app.use(express.json());

console.log('datatabase connected', db.name)

db.exec(`
    CREATE TABLE IF NOT EXISTS database (
       id INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       score INTEGER NOT NULL        
    );`
);
console.log('Database initialized!');

app.post('/api/scores', (req, res) => {
    const insert = db.prepare('INSERT INTO database (name, score) VALUES (?,?)')
    insert.run(req.body.name, req.body.score)
    console.log('Received score data:', req.body);
    const allScores = db.prepare('SELECT * FROM database').all();
    console.log('All scores:', allScores);
    res.json({ message: "Score received!" })
    
})



app.listen(3000, () => {
    console.log('PORT 3000 RUNNING');
    console.log('URL: http://localhost:3000');
});
