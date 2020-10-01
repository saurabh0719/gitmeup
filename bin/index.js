#!/usr/bin/env node 

const simpleGit = require('simple-git/promise');
const chalk = require('chalk');
const inquirer = require('inquirer');

const git = simpleGit();

var branch_name;
var commit_message;

inquirer
  .prompt([
    {
      name: 'branchname',
      message: 'Enter branch name (main) : ',
      default: 'main',
    },
    {
      name: 'commitMessage',
      message: 'Enter commit message : ',
      default: 'update done with gitmeup',
    },
  ])
  .then(answers => {
    console.log('Answers:', answers);
    branch_name = answers.branchname;
    commit_message = answers.commitMessage;
    console.log(branch_name);
    console.log(commit_message);

    git.add('.')
    .then(
       (addSuccess) => {
          //console.log(addSuccess);
          console.log(chalk.green('\nAll files added successfully'))
          git.commit(commit_message)
            .then(
               (success) => {
                //console.log(successCommit);
                  console.log(chalk.magenta('Commit successful : ') + chalk.yellowBright(commit_message))
                  git.pull('origin',branch_name)
                     .then((success) => {
                        console.log(chalk.cyan('Pull successful'));
                        git.push('origin',branch_name)
                           .then((success) => {
                              console.log(chalk.blue('Changes pushed successfully'));
                              process.exit();
                           },(failed)=> {
                              console.log(chalk.red('Push failed'));
                           });
                     },(failed)=> {
                        console.log(chalk.red('Pull failed'));
                  });
               }, (failed) => {
                  console.log(chalk.red('Commit failed'));
         });
       }, (failedAdd) => {
          console.log(chalk.red('Adding files failed'));
    });


  });

  /*
  // Add all files for commit
  git.add('.')
    .then(
       (addSuccess) => {
          //console.log(addSuccess);
          console.log(chalk.green('\nAll files added successfully'))
          git.commit(commit_message)
            .then(
               (success) => {
                //console.log(successCommit);
                  console.log(chalk.magenta('Commit successful : ') + chalk.yellowBright(commit_message))
                  git.pull('origin',branch_name)
                     .then((success) => {
                        console.log(chalk.cyan('Pull successful'));
                        git.push('origin',branch_name)
                           .then((success) => {
                              console.log(chalk.blue('Changes pushed successfully'));
                              process.exit();
                           },(failed)=> {
                              console.log(chalk.red('Push failed'));
                           });
                     },(failed)=> {
                        console.log(chalk.red('Pull failed'));
                  });
               }, (failed) => {
                  console.log(chalk.red('Commit failed'));
         });
       }, (failedAdd) => {
          console.log(chalk.red('Adding files failed'));
    });






/*

// Commit files as Initial Commit
 git.commit(commit_message)
   .then(
      (success) => {
        //console.log(successCommit);
        console.log(chalk.green('Commit successful') + chalk.yellow(commit_message))
     }, (failed) => {
        console.log(chalk.red('Commit failed'));
 });

 git.pull('origin',branch_name)
    .then((success) => {
       console.log(chalk.blue('Pull successful'));
    },(failed)=> {
       console.log(chalk.red('Pull failed'));
 });

// Finally push to online repository
 git.push('origin',branch_name)
    .then((success) => {
       console.log(chalk.blue('Changes pushed successfully'));
    },(failed)=> {
       console.log(chalk.red('Push failed'));
 });

 process.exit()

*/