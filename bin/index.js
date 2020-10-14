#!/usr/bin/env node 

const simpleGit = require('simple-git/promise');
const chalk = require('chalk');
const inquirer = require('inquirer');
const logSymbols = require('log-symbols');

const git = simpleGit();
var branch_name;
var commit_message;

inquirer
  .prompt([
    {
      name: 'branchname',
      message: 'Enter branch name : ',
      default: 'main',
    },
    {
      name: 'commitMessage',
      message: 'Enter commit message : ',
      default: 'update done with gitmeup',
    },
  ])
  .then(answers => {
    //console.log('Answers:', answers);
    branch_name = answers.branchname;
    commit_message = answers.commitMessage;
    //console.log(branch_name);
    //console.log(commit_message);

    git.add('.')
    .then(
       (success) => {
          console.log("");
          console.log(logSymbols.success, chalk.yellowBright('All files added successfully'))
          git.commit(commit_message)
            .then(
               (success) => {
                  console.log(logSymbols.success, chalk.magenta('Commit successful : ') + chalk.green(commit_message))
                  console.log(success);
                  git.pull('origin',branch_name)
                     .then((success) => {
                        console.log(logSymbols.success, chalk.cyan('Pull successful'));
                        console.log(success);
                        git.push('origin',branch_name)
                           .then((success) => {
                              console.log(logSymbols.success, chalk.blue('Changes pushed successfully\n'));
                              console.log(success);
                              console.log("");
                              console.log(chalk.red('gitmeup ') + chalk.white.bold('\u20AA ') + chalk.cyan('saurabh0719'))
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
