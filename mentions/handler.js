const yargs = require('yargs');

const executeCreate = require('./commands/create.js');
const executeList = require('./commands/list.js');

const handle = async (text, service, say) => {
  yargs
    .command({
      command: 'list',
      handler: () => {
        executeList(service, say);
      }
    })
    .command({
      command: 'create <name> [description]',
      builder: (yargs) => {
        yargs.positional('name', {
          type: 'string',
          describe: 'The name of the rota to create'
        });
        yargs.option('description', {
          type: 'string',
          describe: 'An optional description of the rota'
        });
      },
      handler: (argv) => {
        const name = removeQuotes(argv.name);
        const description = removeQuotes(argv.description);
        executeCreate(service, name, description);
      }
    })
    .command({
      command: '*', 
      handler: () => {
        say('unknown command');
      }
    })
    .parse(text);
};

function removeQuotes(string) {
  return string.replace(/"+/g, '');
}

module.exports = { handle };