const yargs = require('yargs');

const executeAdd = require('./commands/add');
const executeCreate = require('./commands/create');
const executeDelete = require('./commands/delete');
const executeHelp = require('./commands/help');
const executeList = require('./commands/list');
const executeShow = require('./commands/show');

module.exports = async (text, service, say) => {
  const removeQuotes = (string) => string.replace(/"+/g, '');

  const parser = yargs
    .command({
      command: 'list',
      handler: () => {
        executeList(service, say);
      }
    })
    .command({
      command: 'help',
      handler: () => {
        executeHelp(say);
      }
    })
    .command({
      command: 'create <name> [description]',
      builder: (yargs) => {
        yargs.positional('name', {
          type: 'string',
          describe: 'the name of the rota to create',
        });
        yargs.option('description', {
          type: 'string',
          describe: 'an optional description of the rota'
        });
      },
      handler: (argv) => {
        const description = argv.description ? removeQuotes(argv.description) : undefined;
        executeCreate(argv.name, description, service, say);
      }
    })
    .command({
      command: 'delete <name>',
      builder: (yargs) => {
        yargs.positional('name', {
          type: 'string',
          describe: 'the name of the rota to delete',
        });
      },
      handler: (argv) => {
        executeDelete(argv.name, service, say);
      }
    })
    .command({
      command: 'add <name> [users...]',
      builder: (yargs) => {
        yargs.positional('name', {
          type: 'string',
          describe: 'the name of the rota to add users to',
        });
        yargs.option('users', {
          type: 'string',
          describe: 'the users to add',
        });
      },
      handler: (argv) => {
        executeAdd(argv.name, argv.users, service, say);
      }
    })
    .command({
      command: 'show <name>',
      builder: (yargs) => {
        yargs.positional('name', {
          type: 'string',
          describe: 'the name of the rota to show',
        });
      },
      handler: (argv) => {
        executeShow(argv.name, service, say);
      }
    })
    .command({
      command: '*',
      handler: () => {
        throw new Error('Unknown command')
      }
    })
    .help(false)
    .fail(false)

  try {
    await parser.parse(text);
  } catch (error) {
    say("🤔 I'm sorry, I didn't understand that. Please try rephrasing your question or enter `@Rota help` to see a list of available commands.");
  }
};


