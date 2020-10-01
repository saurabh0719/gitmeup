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
      message: 'Enter branch name (default : master) : ',
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
  });

  // Add all files for commit
  git.add('.')
    .then(
       (addSuccess) => {
          //console.log(addSuccess);
          console.log(chalk.green('All files added successfully'))
       }, (failedAdd) => {
          console.log(chalk.red('Adding files failed'));
    });
// Commit files as Initial Commit
 git.commit(commit_message)
   .then(
      (successCommit) => {
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

