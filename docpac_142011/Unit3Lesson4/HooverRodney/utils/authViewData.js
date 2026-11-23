function checkIfLoggedIn(req, res, next) {
    if (!req.session.userId) {
        res.locals.isLoggedIn = false;
    } else {
        res.locals.isLoggedIn = true;
    }
    next();
}

module.exports = checkIfLoggedIn;