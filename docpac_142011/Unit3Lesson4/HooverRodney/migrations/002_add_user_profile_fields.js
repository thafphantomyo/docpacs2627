module.exports = {
    name: "002_add_user_profile_fields.js",
    up: function (db) {
        db.exec(`
            ALTER TABLE users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1
        `);
    }
}