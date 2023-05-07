const parser = require('yargs');

const executeAdd = require('./commands/add');
const executeCreate = require('./commands/create');
const executeDelete = require('./commands/delete');
const executeHelp = require('./commands/help');
const executeList = require('./commands/list');

module.exports = async (text, service, say) => {
  const removeQuotes = (string) => string.replace(/"+/g, '');

  return parser
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
      command: '*',
      handler: () => {
        say('unknown command');
      }
    })
    .help(false)
    .parse(text);
};


