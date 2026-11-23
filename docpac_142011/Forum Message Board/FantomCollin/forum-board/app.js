const express = require('express');
const app = express()
const session = require('express-session')

const db = require('./database.js')

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

app.post('/register', (req, res) => {
    const username = req.body.userSignup
    const password = req.body.passwordSignup;
    const repPassword = req.body.repasswordSignup;

    const findByUser = db.prepare(`SELECT * FROM users WHERE username = ?`).get(username)
    const createUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?, ?)`).run(username, password)

    if ( typeof username !== 'string' || typeof password !== 'string' || 
        username.trim() === '' || password !== repPassword) {
        return res.status(400).render('error', { appName: process.env.APP_NAME, status: res.statusCode, statusInstr: 'PLEASE ENTER A VALID USER/EMAIL OR PASSWORDS DO NOT MATCH, PLEASE TRY AGAIN', currentPage: 'register' })
    } else {
        if ( findByUser && findByUser.username === username ) {
            res.render('register', {
                appName: process.env.APP_NAME, currentPage: 'register', foundDupe: 'Username/Email already exists!'
            });
        } else {
            console.log('swows', username)
            userModel.createUser(username, email, password)
            res.render('login', { appName: process.env.APP_NAME, currentPage: 'login', errMessage: '' })
        };
    };
})

app.listen(3000, () => {
    console.log(`This jawn is running at port 3000`);
    console.log(`URL: http://localhost:3000`);
});