const parser = require('yargs');

const executeCreate = require('./commands/create');
const executeDelete = require('./commands/delete');
const executeList = require('./commands/list');

function removeQuotes(string) {
  return string.replace(/"+/g, '');
}

const handle = async (text, service, say) => {
  parser
    .command({
      command: 'list',
      handler: () => {
        executeList(service, say);
      },
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
          describe: 'an optional description of the rota',
        });
      },
      handler: (argv) => {
        const name = removeQuotes(argv.name);
        const description = removeQuotes(argv.description);
        executeCreate(name, description, service, say);
      },
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
        const name = removeQuotes(argv.name);
        executeDelete(name, service, say);
      },
    })
    .command({
      command: '*',
      handler: () => {
        say('unknown command');
      },
    })
    .parse(text);
};

module.exports = { handle };
