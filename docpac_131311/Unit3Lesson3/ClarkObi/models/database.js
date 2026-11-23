const sqlite=require('better-sqlite3');
const path=require('path');
const dbPath=path.join(__dirname,'..','data','app.db');
const app=new sqlite(dbPath,{verbose:console.log});
module.exports=app