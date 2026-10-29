const express = require('express');
const app = express();

app.use(express.static('public'))

app.use(express.json)

app.listen(3000, () => {
    console.log('PORT 3000 RUNNING')
    console.log('URL: http://localhost:3000');
    
})
