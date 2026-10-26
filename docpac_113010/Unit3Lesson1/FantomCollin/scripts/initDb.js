const db = new sql('/data/app.db', { verbose: console.log, fileMustExist: false })

db.exec(
    
    `CREATE TABLE IF NOT EXISTS database (
       id INTEGER PRIMARY KEY,
       input TEXT NOT NULL,
       method TEXT NOT NULL,
       timestamp TEXT DEFAULT CURRENT-TIMESTAMP         
    )`
    
)