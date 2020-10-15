const JSONdb = require('simple-json-db');
const db = new JSONdb('./settings.json');

db.set('branch', 'main');
db.set('message', 'update');

let def_branch = db.get('branch');
let def_message = db.get('message');

console.log(def_branch);
console.log(def_message);
