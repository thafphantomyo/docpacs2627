const db = require('../models/database.js');

function createUser(username, email, password, is_active = 1) {
    const sql = `INSERT INTO users (username, email, password, is_active) VALUES (?, ?, ?, ?)`;
    const users = db.prepare(sql).run(username, email, password, is_active);
    return users;
}

function findUserByUsername(username) {
    const sql = `SELECT * FROM users WHERE username = ?`;
    const user = db.prepare(sql).get(username);
    return user;
}

function findUserByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const user = db.prepare(sql).get(email);
    return user;
}

function findUserById(id) {
    const sql = `SELECT * FROM users WHERE id = ?`;
    const user = db.prepare(sql).get(id);
    return user;
}

module.exports = {
    createUser,
    findUserByUsername,
    findUserByEmail,
    findUserById
}