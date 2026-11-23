const express = require('express');
const userModel = require('../models/userModel');
const db = require('../models/database');

const auth = express.Router();

auth.get('/register', (req, res) => {
    res.render('register', {
        appName: process.env.APP_NAME, currentPage: 'register', foundDupe: ''
    })
});

auth.post('/register', (req, res) => {
    const username = req.body.userSignup
    const email = req.body.emailSignup
    const password = req.body.passwordSignup
    const repPassword = req.body.repasswordSignup

    if (username.trim() === '' || email.trim() === '' || password !== repPassword) {
        return res.status(400).render('error', { appName: process.env.APP_NAME, status: res.statusCode, statusInstr: 'PLEASE ENTER A VALID USER/EMAIL OR PASSWORDS DO NOT MATCH, PLEASE TRY AGAIN', currentPage: 'register' })
    } else {
        const userCheck = userModel.findByUser(username)
        const emailCheck = userModel.findByEmail(email)

        if (userCheck && userCheck.username === username || emailCheck && emailCheck.email === email) {
            res.render('register', {
                appName: process.env.APP_NAME, currentPage: 'register', foundDupe: 'Username/Email already exists!'
            })
        } else {
            console.log('swows', username)
            userModel.createUser(username, email, password)
            res.render('login', { appName: process.env.APP_NAME, currentPage: 'login', errMessage: '' })
        }
    }

});

auth.get('/login', (req, res) => {
    if (req.session.userId != null) {
        return res.redirect('/account')
    } else {
        res.render('login', { appName: process.env.APP_NAME, currentPage: 'login', errMessage: '' })
    }
});

auth.post('/login', (req, res) => {
    const username = req.body.usernameLogin
    const password = req.body.passwordLogin

    if (!username || username.trim() === '' && !password || password.trim() === '') {
        res.render('login', { appName: process.env.APP_NAME, currentPage: 'login', errMessage: 'Please enter a valid Username or Password' })
    } else {
        const userCheck = userModel.findByUser(username)

        if (userCheck && userCheck.username === username && userCheck.password === password) {
            req.session.userId = userCheck.id

            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).send('Login error');
                }

                res.redirect('/account');
            });
        } else {
            res.render('login', { appName: process.env.APP_NAME, currentPage: 'login', errMessage: 'Please enter a valid Username or Password' })
        }
    }
})

auth.post('/logout', (req, res) => {
    delete req.session.userId

    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
            return res.status(500).send('Logout error');
        }
        res.redirect('login')
    });
});

auth.get('/account', (req, res) => {
    console.log(req.session);
    if (req.session.userId != null) {
        const userCheck = userModel.findById(req.session.userId)
        const username = userCheck.username
        const email = userCheck.email
        const createDate = userCheck.created_at
        res.render('account', { appName: process.env.APP_NAME, currentPage: 'account', username: username, email: email, createDate: createDate })
    } else {
        return res.render('login', { appName: process.env.APP_NAME, currentPage: 'login', errMessage: '' })
    }
});

module.exports = auth;