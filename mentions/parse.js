const yargs = require('yargs');

const executeAdd = require('./commands/add');
const executeAssign = require('./commands/assign');
const executeCreate = require('./commands/create');
const executeDelete = require('./commands/delete');
const executeHelp = require('./commands/help');
const executeList = require('./commands/list');
const executeShow = require('./commands/show');
const executeWho = require('./commands/who');

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
        yargs.positional('name', { type: 'string' });
        yargs.option('description', { type: 'string' });
      },
      handler: (argv) => {
        const description = argv.description ? removeQuotes(argv.description) : undefined;
        executeCreate(argv.name, description, service, say);
      }
    })
    .command({
      command: 'delete <name>',
      builder: (yargs) => {
        yargs.positional('name', { type: 'string' });
      },
      handler: (argv) => {
        executeDelete(argv.name, service, say);
      }
    })
    .command({
      command: 'add <name> [users...]',
      builder: (yargs) => {
        yargs.positional('name', { type: 'string' });
        yargs.option('users', { type: 'string' });
      },
      handler: (argv) => {
        executeAdd(argv.name, argv.users, service, say);
      }
    })
    .command({
      command: 'show <name>',
      builder: (yargs) => {
        yargs.positional('name', { type: 'string' });
      },
      handler: (argv) => {
        executeShow(argv.name, service, say);
      }
    })
    .command({
      command: 'assign <user> <rota>',
      builder: (yargs) => {
        yargs.positional('user', { type: 'string' });
        yargs.positional('rota', { type: 'string' });
      },
      handler: (argv) => {
        executeAssign(argv.user, argv.rota, service, say);
      }
    })
    .command({
      command: 'who <rota>',
      builder: (yargs) => {
        yargs.positional('rota', { type: 'string' });
      },
      handler: (argv) => {
        executeWho(argv.rota, service, say);
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


