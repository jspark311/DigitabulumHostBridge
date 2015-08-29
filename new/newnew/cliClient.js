/*
* This is to become the transport test directory.
*
*/
'use strict'

//TODO: There is probably a better means of reading this from the package.json....
var packageJSON = require('./package.json');


/****************************************************************************************************
* We are using chalk for console formatting.                                                        *
****************************************************************************************************/

var chalk = require('chalk');
// Let's take some some time to setup some CLI styles.
var error = chalk.bold.red;



/****************************************************************************************************
* This is junk related to prompt.                                                                   *
****************************************************************************************************/
var prompt       = require('prompt');
prompt.message   = '';
prompt.delimiter = '';


/****************************************************************************************************
* Functions that just print things.                                                                 *
****************************************************************************************************/

/*
*
*/
function printUsage() {
  console.log(chalk.white("MHB Debug Console\n========================================================================"));
  console.log(chalk.cyan('msglegend    ') + chalk.gray('Display the message legend.'));
  console.log(chalk.cyan('nodestack    ') + chalk.gray('Dump the stack-trace.'));
  console.log(chalk.cyan('quit         ') + chalk.gray('Cleanup and exit the program.'));
}

/*
*	PrObLeM???
*/
function troll() {
	console.log("\n");
	console.log(chalk.white("777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777"));
	console.log(chalk.white("777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777"));
	console.log(chalk.white("777777777777777777777777777777777............................................7777777777777777777777"));
	console.log(chalk.white("7777777777777777777777777................7777777777777777777777777777777777.....7777777777777777777"));
	console.log(chalk.white("7777777777777777777...........7777777777.....777777777777777..7777777777777777...777777777777777777"));
	console.log(chalk.white("77777777777777777....77777777777777777777777777777777777777777777..7777777777777...7777777777777777"));
	console.log(chalk.white("77777777777777....7777.77......777777777777...77777777777777..777777.777777777777...777777777777777"));
	console.log(chalk.white("777777777777....7777777777777777777777777777777777777777777777777..7777.7777777777...77777777777777"));
	console.log(chalk.white("77777777777...777777777777.....77777777777777777777.7777777777...777.7777.777777777...7777777777777"));
	console.log(chalk.white("7777777777..77777777777.7777777777777777777777777.7777777777777777..777.7777.7777777...777777777777"));
	console.log(chalk.white("7777777777..777777777.777777777777.7777777777777777777777777777777777.77.7777.7777777..777777777777"));
	console.log(chalk.white("7777777777..77777777.77777777777777777777777777777777777777777777777777.77.77777777777..77777777777"));
	console.log(chalk.white("777777777..777777777777777777777777777777777777777777..............7777777777777777777...7777777777"));
	console.log(chalk.white("77777777...777777777777........7777777777777777777.....777............77777777777777777...777777777"));
	console.log(chalk.white("7777....77777777777..............7777777777777....777777........77...777777777777777777...777777777"));
	console.log(chalk.white("777...777.....7...7...............77777777777...77777.................7777.7777........7....7777777"));
	console.log(chalk.white("77..777.777777777777777777.............7777777.........77777777777..777.777777777777777777...777777"));
	console.log(chalk.white("7..77.777..777777777777777777777....77777777777.....777777...77777777777777..........7777777..77777"));
	console.log(chalk.white("7..7.77.777......7777777777777777..7777777777777777777777777....7777777......777777....7777.7..7777"));
	console.log(chalk.white("7...77777..........7777.777777777..777777777777777777777777777...........77777..77777...777.77...77"));
	console.log(chalk.white("7...77777.7777777........77777777..7777777777777777777777777777777777777777777..777777..777.77...77"));
	console.log(chalk.white("7...77.7777777..77....77777777....77777777777777777777777777777777777777777.....7777777..77.777..77"));
	console.log(chalk.white("7..7777.777777..77777777777....7777777777777777........7777777777777777.....777......77..77.777..77"));
	console.log(chalk.white("7....777..77....7777777777.....77777777777777777777..77777777777777......77777...7...7...77.77...77"));
	console.log(chalk.white("77..7..77777....7777777..77.....777777777.......777..7777777777.......77777777..777777..777777...77"));
	console.log(chalk.white("77...7777.77..7...777.77777777...77777777777777.7...777777........7..7777777....77777..777.77...777"));
	console.log(chalk.white("777...77777.........777777777777......777777777777777........777777..7777......777777777..77..77777"));
	console.log(chalk.white("7777...7777..7..7......77777777777...77777777777........7777777777...7........7777777.77777...77777"));
	console.log(chalk.white("77777..7777....77..77........77777777..............77..7777777777.......77...7777777777.....7777777"));
	console.log(chalk.white("77777..7777....77..7777....................7777777777..777777........7777...777777777777...77777777"));
	console.log(chalk.white("77777..7777....77..777...7777777..7777777..7777777777...7.........7..777...77777777777...7777777777"));
	console.log(chalk.white("77777..7777........777..77777777..7777777..777777777...........7777..77...77777777777...77777777777"));
	console.log(chalk.white("77777..7777.................................................7777777......777777777777..777777777777"));
	console.log(chalk.white("77777..7777...........................................7..77777777777...7777777777777...777777777777"));
	console.log(chalk.white("77777..77777....................................7777777..777777777...77777777777777...7777777777777"));
	console.log(chalk.white("77777..77777..7...........................7..7777777777...77777....777777777777777...77777777777777"));
	console.log(chalk.white("77777..777777..7..77..777..77777...77777777..77777777777..777....777777777777777...7777777777777777"));
	console.log(chalk.white("77777..777777......7...777..77777..77777777..777777777777......7777777777777777...77777777777777777"));
	console.log(chalk.white("77777..7777777....777...77...7777..77777777..777777777......7777777.77777.777...7777777777777777777"));
	console.log(chalk.white("77777..777777777.........77..7777...7777777..77.........77777777.77777..777....77777777777777777777"));
	console.log(chalk.white("77777..77777777777777...............................777777777..7777..7777....7777777777777777777777"));
	console.log(chalk.white("7777...77777777.777777777777777777777777777777777777777777.77777..7777.....777777777777777777777777"));
	console.log(chalk.white("7777..7777777777.777777777777777777777777777777777777..777777.77777.....777777777777777777777777777"));
	console.log(chalk.white("7777..777777777777.777777777777777777777777777777..777777..77777.....777777777777777777777777777777"));
	console.log(chalk.white("77..77777..77777777...77777777777..........777777..7777777......77777777777777777777777777777777777"));
	console.log(chalk.white("7..777777777.7777777777777777777777777...777777777777.....77777777777777777777777777777777777777777"));
	console.log(chalk.white("7...7777777777...............777777777777777777777.....77777777777777777777777777777777777777777777"));
	console.log(chalk.white("7...777777777777777777777777777777777777777777.....777777777777777777777777777777777777777777777777"));
	console.log(chalk.white("77...77777777777777777777777777777777777..7.....777777777777777777777777777777777777777777777777777"));
	console.log(chalk.white("777....7777777777777777777777777777..........777777777777777777777777777777777777777777777777777777"));
	console.log(chalk.white("7777.....7777777777777777777.........77777777777777777777777777777777777777777777777777777777777777"));
	console.log(chalk.white("7777777........................77777777777777777777777777777777777777777777777777777777777777777777"));
	console.log(chalk.white("777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777"));
}



function promptUserForDirective() {
  console.log(chalk.white(packageJSON.name + '  v' + packageJSON.version));
  prompt.get([{name: 'directive', description: 'Directive> '.cyan}], function (prompt_err, result) {
    if (prompt_err) {
      console.log(error('\nno. die. ' + prompt_err));
      process.exit(1);
    }
    else {
      switch(result.directive) {
        case 'troll':
          troll();
          break;
        case 'history':      // Print a history of our directives.
          
          break;
        case 'nodestack':    // Tell node to print a trace of this process.
          console.trace();
          break;
        case 'quit':         // Return 0 for no-error-on-exit.
        case 'exit':
          process.exit();
          break;
        default:             // Show user help and usage info.
          console.log(result);
          printUsage();
          break;
      }
    }

    console.log("\n");
    promptUserForDirective();
  });
}



/****************************************************************************************************
* Execution begins below this block.                                                                *
****************************************************************************************************/

prompt.start();    // Start prompt running.


// Kick off the interaction by prompting the user.
promptUserForDirective();
