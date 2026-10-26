const sql = require('better-sqlite3')
const db = new sql('/data/app.db', { verbose: console.log, fileMustExist: false })



module.exports  = db