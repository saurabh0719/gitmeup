#!/usr/bin/env node 

const simpleGit = require('simple-git/promise');
const chalk = require('chalk');
const inquirer1 = require('inquirer');
const inquirer2 = require('inquirer');
const logSymbols = require('log-symbols');
const JSONdb = require('simple-json-db');
const db = new JSONdb('./settings.json');
const git = simpleGit();

let branch_name;
let commit_message;

let def_branch = db.get('branch');
let def_message = db.get('message');
let commit_log = db.get('log');


require('yargs')
  .scriptName("pirate-parser")
  .usage('$0 <cmd>')
  .command('defaults', 'Change defaults', (yargs) => {}, function (argv) {

   inquirer1.prompt([
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
    {
      type: 'list',
      name: 'logSettings',
      message: 'Do you want command logs/details? ',
      choices: ['Yes', 'No'],
    }
  ])
  .then(answers => {
    //console.log('Answers:', answers);
    db.set('branch',answers.defaultBranch);
    db.set('message',answers.defaultMessage);
    if(answers.logSettings == 'Yes')
      db.set('log',1);
    else db.set('log',0);
    process.exit();

  });
    
  })
  .usage('$0 <cmd>')
  .command('run', 'Run gitmeup (add ., commit, pull, push)', (yargs) => {}, function (argv) {

   inquirer2.prompt([
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
          if(commit_log){ 
            console.log(""); 
         }
          git.commit(commit_message)
            .then(
               (success) => {
                  console.log(logSymbols.success, chalk.magenta('Commit successful : ') + chalk.green(commit_message))
                  if(commit_log){ 
                     console.log(success);
                     console.log(""); 
                  }
                  git.pull('origin',branch_name)
                     .then((success) => {
                        console.log(logSymbols.success, chalk.cyan('Pull successful'));
                        if(commit_log){ 
                           console.log(success);
                           console.log(""); 
                        }
                        git.push('origin',branch_name)
                           .then((success) => {
                              console.log(logSymbols.success, chalk.blue('Changes pushed successfully\n'));
                              if(commit_log){ 
                                 console.log(success);
                                 console.log(""); 
                              }
                              console.log(chalk.red('gitmeup ') + chalk.white.bold('\u20AA ') + chalk.cyan('saurabh0719'))
                              process.exit();
                           },(failed)=> {
                              console.log(chalk.red('Push failed'));
                              console.log(failed);
                           });
                     },(failed)=> {
                        console.log(chalk.red('Pull failed'));
                        console.log(failed);
                  });
               }, (failed) => {
                  console.log(chalk.red('Commit failed'));
                  console.log(failed);
         });
       }, (failedAdd) => {
          console.log(chalk.red('Adding files failed'));
          console.log(failedAdd);
    });


  });
    
  })
  .help()
  .argv



