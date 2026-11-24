const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require("bcrypt");


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
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 12345678
        }
    })
);

app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId
        ? { id: req.session.userId, username: req.session.username }
        : null;
    next();
})

app.get('/', (req, res, next) => {
    try {
        const threads = db.prepare(`
            SELECT threads.id, threads.title, threads.created_at,
                   users.id AS user_id, users.username
            FROM threads
            JOIN users ON threads.user_id = users.id
            ORDER BY threads.created_at ASC, threads.id ASC
        `).all();

        res.render('index', { threads });
    } catch (err) {
        next(err);
    }
});

app.get('/register', (req, res) => {
    res.render('register', { verbose: console.log })
})

app.post('/register', async (req, res, next) => {
    try {
        const username = (req.body.userSignup || '').trim();
        const password = req.body.passwordSignup || '';
        const repPassword = req.body.repasswordSignup || '';

        let problem = null;
        if (!username) problem = 'Username is required.';
        else if (username.length < 3 || username.length > 30) problem = 'Username must be 3–30 characters.';
        else if (!password) problem = 'Password is required.';
        else if (password.length < 12) problem = 'Password must be at least 12 characters.';
        else if (password !== repPassword) problem = 'Passwords do not match.';

        if (problem) {
            return res.status(400).render('error', {
                status: 400, statusInstr: problem, currentPage: 'register'
            });
        }

        const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (existing) {
            return res.status(409).render('register', {
                currentPage: 'register', foundDupe: 'That username is already taken.'
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
            .run(username, passwordHash);

        res.redirect('/login');
    } catch (err) {
        next(err);
    }
});

app.get('/login', (req, res) => {
    res.render('login', { errMessage: null });
})

app.post('/login', async (req, res, next) => {
    const invalidError = 'Invalid username or password.';

    try {
        const username = req.body.usernameLogin.trim();
        const password = req.body.passwordLogin || '';

        if (!username || !password) {
            return res.status(401).render('login', { errMessage: invalidError });
        }

        const findByUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

        const passwordMatches = findByUser
            ? await bcrypt.compare(password, findByUser.password_hash)
            : false;
        if (!passwordMatches) {
            return res.status(401).render('login', { errMessage: invalidError });
        };
        req.session.regenerate((err) => {
            if (err) return next(err);

            req.session.userId = findByUser.id;
            req.session.username = findByUser.username;

            req.session.save((err) => {
                if (err) return next(err);
                res.redirect('/');
            });
        });
    } catch (err) {
        next(err);
    };
});

app.use(function isAuthenticated(req, res, next) {
    if (req.session.userId) return next();
    res.redirect('/login');})

app.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});
app.get('/profile', (req, res) => {
    res.render('profile', {  })
})

app.get('/threads/new', (req, res) => {
    res.render('newThread', {  });
});

app.post('/threads', (req, res, next) => {
    try {
        const title = (req.body.title || '').trim();
        const body = (req.body.body || '').trim();

        let problem = null;
        if (!title) problem = 'Thread title is required.';
        else if (title.length > 100) problem = 'Title must be 100 characters or fewer.';
        else if (!body) problem = 'Thread body is required.';
        else if (body.length > 5000) problem = 'Post must be 5000 characters or fewer.';

        if (problem) {
            return res.status(400).render('error', {
                status: 400, statusInstr: problem, currentPage: 'newThread'
            });
        }

        const result = db
            .prepare('INSERT INTO threads (user_id, title, body) VALUES (?, ?, ?)')
            .run(req.session.userId, title, body);

        res.redirect(`/threads/${result.lastInsertRowid}`);
    } catch (err) {
        next(err);
    }
});

app.listen(6767, () => {
    console.log(`This jawn is running at port 6767`);
    console.log(`URL: http://localhost:6767`);
});