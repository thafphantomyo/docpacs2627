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
    console.log('Received score data:', req.body);

    res.json({ message: "Score reveived!" })
    
})



app.listen(3000, () => {
    console.log('PORT 3000 RUNNING');
    console.log('URL: http://localhost:3000');
});
