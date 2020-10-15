#!/usr/bin/env node 

const simpleGit = require('simple-git/promise');
const chalk = require('chalk');
const inquirer = require('inquirer');
const logSymbols = require('log-symbols');
const JSONdb = require('simple-json-db');
const db = new JSONdb('./settings.json');
const git = simpleGit();

let branch_name;
let commit_message;

let def_branch = db.get('branch');
let def_message = db.get('message');


require('yargs')
  .scriptName("pirate-parser")
  .usage('$0 <cmd>')
  .command('-d', 'Change defaults', (yargs) => {}, function (argv) {

   inquirer.prompt([
    {
      name: 'defaultBranch',
      message: 'Set default branch name : ',
      default: def_branch,
    },
    {
      name: 'defaultMessage',
      message: 'Set default commit message : ',
      default: def_message,
    },
  ])
  .then(answers => {
    //console.log('Answers:', answers);
    db.set('branch',answers.defaultBranch);
    db.set('message',answers.defaultMessage);
    process.exit();
  });
    
  })
  .usage('$0 <cmd>')
  .command('run', 'Run gitmeup (add ., commit, pull, push)', (yargs) => {}, function (argv) {

   inquirer
  .prompt([
    {
      name: 'branchname',
      message: 'Enter branch name : ',
      default: def_branch,
    },
    {
      name: 'commitMessage',
      message: 'Enter commit message : ',
      default: def_message,
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
    
  })
  .help()
  .argv



