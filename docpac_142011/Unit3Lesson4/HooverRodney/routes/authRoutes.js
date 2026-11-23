const express = require('express');
const router = express.Router();
const path = require('path');
const { createUser, findUserByUsername, findUserByEmail, findUserById } = require('../models/userModel.js');
const port = process.env.PORT;
const appName = process.env.APP_NAME;

router.get('/register', (req, res) => {
    res.render('register.ejs', {
        pageTitle: "Registration Form",
        error: null
    })
})

router.post('/register', (req, res) => {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password = req.body.password?.trim();
    const confirmPassword = req.body.confirmPassword?.trim();

    //Data Validation
    if (!username || !email || !password) {
        console.log('Validation failed - missing fields');
        res.render('error.ejs', {
            pageTitle: "An Error Has Occurred!",
            statusCode: 422,
            errorHeading: "Error 422: Unprocessable Content",
            message: "At least one input was blank or invalid! Please enter valid user information or ",
            linkText: "return to the homepage",
            linkURL: "/"
        });
        return;
    }

    if (password !== confirmPassword) {
        res.render('error.ejs', {
            pageTitle: "An Error Has Occurred!",
            statusCode: 422,
            errorHeading: "Error 422: Unprocessable Content",
            message: "Your passwords did not match! Please ensure the \"Password\" and \"Confirm Password\" fields are the same, or ",
            linkText: "return to the homepage",
            linkURL: "/"
        })
        return;

    }

    if (username.length >= 20 || username.length < 3) {
        res.render('error.ejs', {
            pageTitle: "An Error Has Occurred!",
            statusCode: 422,
            errorHeading: "Error 422: Unprocessable Content",
            message: "Your username didn't meet the length requirements! Either provide a valid username or ",
            linkText: "return to the homepage",
            linkURL: "/"
        })
        return;
        
    }

    if (!emailPattern.test(email)) {
        res.render('error.ejs', {
            pageTitle: "An Error Has Occurred!",
            statusCode: 422,
            errorHeading: "Error 422: Unprocessable Content",
            message: "Your email was invalid (most likely formatted incorrectly)! Either provide a properly-formatted email or ",
            linkText: "return to the homepage",
            linkURL: "/"
        })
        return;
    }

    //Check for Duplicates
    const existingUsername = findUserByUsername(username);
    if(existingUsername) {
        res.render('register.ejs', {
            pageTitle: "Registration Form",
            error: "That username is taken!"
        })
        return;
    }

    const existingEmail = findUserByEmail(email);
    if(existingEmail) {
        res.render('register.ejs', {
            pageTitle: "Registration Form",
            error: "That email address is already in use!"
        })
        return;
    }

    const result = createUser(username, email, password);
    req.session.userId = result.lastInsertRowid;

    res.redirect('/account');
})

router.get('/login', (req, res) => {
    if(!req.session || !req.session.userId) {
        res.render('login', {
            pageTitle: "Login",
            error: null
        });
    } else if (req.session.userId) {
        res.render('account', {

        })
    }
})

router.post('/login', (req, res) => {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    let error;

    if (!email || !password) {
        if(!email) {
            error = "You didn't enter an email!";
        } else {
            error = "You didn't enter a password!";
        }
        res.render('login', {
            pageTitle: "Login Form",
            error: error
        });
        return;
    } else {
        const user = findUserByEmail(email);
        if(!user) {
            error = "An account with the associated email does not exist!"
            res.render('login', {
                pageTitle: "Login Form",
                error: error
            })
            return;
        }
        if (password == user.password) {
            req.session.userId = user.id;
            res.redirect('/account');
            console.log(user);
        } else if(password !== user.password) {
            error = "Incorrect password!";
            res.render('login', {
                pageTitle: "Login Form",
                error: error
            })
        }
    }
})

router.post('/logout', (req, res) => {
    req.session.destroy((error) => {
        if(error) {
            console.log("Unable to destroy session!");
            res.redirect('/login')
        } else {
            res.redirect('/');
        }
    });
})

router.get('/account', (req, res) => {
    if(!req.session || !req.session.userId) {
        res.redirect('/login');
    } else {
        const user = findUserById(req.session.userId);
        if (!user) {
            res.render('register', {
                pageTitle: "Registration Page",
                error: "Something went wrong! The user ID no longer matches an account!"
            })
        } else {
            res.render('account', {
                pageTitle: `${user.username}`,
                username: user.username,
                email: user.email,
                date_created: user.created_at
            })
        }
    }
})

module.exports = router;