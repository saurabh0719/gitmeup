const simpleGit = require('simple-git/promise');

simpleGit.status()
    .then(
       (StatusResult) => {
          //console.log(addSuccess);
          console.log(StatusResult);
       });