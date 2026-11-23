require('dotenv').config()
const db = require('./database.js')
const express = require('express');
const PORT = process.env.PORT 
const app = express();
app.use(express.static('public/'));
app.use(express.json()); 
app.post('/api/scores',(req,res)=>{
    const username=req.body.Username
    const highscore=req.body.Highscore
    if(!username){res.status(400).json({message:'Please enter a name.'})
        return};
    if(username.trim()===""){res.status(400).json({message:'Please enter a valid name.'})
        return};
    if(username.length>30){res.status(400).json({message:'Please enter a valid name.'})
        return};
    if(typeof highscore !== "number"){res.status(400).json({message:'Invalid score'})
        return};
    if(Number.isInteger(highscore)===false){res.status(400).json({message:'Invalid score'})
        return};
    if(highscore<0){res.status(400).json({message:'Invalid score'})
        return};
    const stmt =db.prepare('INSERT INTO score(name,score)VALUES(?,?)')
    stmt.run(username,highscore)
    res.status(201).json({message:'score submited successfully'})
});
app.get('/api/scores',(req,res)=>{
    const stmt= db.prepare('SELECT name,score FROM score ORDER BY score DESC LIMIT 10')
    const scoreValues=stmt.all()
    res.status(200).json(scoreValues)
});
app.listen(PORT,()=>{console.log('server: http://localhost:'+PORT);});