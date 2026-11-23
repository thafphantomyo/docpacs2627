const SQL= require('better-sqlite3');
const db=new SQL('data/scores.db',{verbose: console.log});
module.exports=db