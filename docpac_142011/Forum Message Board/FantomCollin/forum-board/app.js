const express = require('express');
const app = express()
const session = require('express.session')

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: 'skibiditoilet',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: 12345678
        }
    })
);

app.use((req, res, next) => {
    res.locals.currentUser = {
        id: req.session.userId,
        username: req.session.username
    } || null;
    next();
})

app.get('/', (req, res) => {
    res.render('index', { verbose: console.log })
});

app.get('/register', (req, res) => {
    res.render('register', { verbose: console.log })
})

app.post('/register' ())

app.listen(3000, () => {
    console.log(`This jawn is running at port 3000`);
    console.log(`URL: http://localhost:3000`);
});