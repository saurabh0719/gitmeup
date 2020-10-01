const simpleGit = require('simple-git/promise');

const git = simpleGit();

// promise
git.status().then(result => {console.log(result)});