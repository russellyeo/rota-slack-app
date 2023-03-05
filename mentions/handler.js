const yargs = require('yargs');

const commandCreate = require('./commands/create.js');
const commandList = require('./commands/list.js');

const handle = async (text, service, say) => {
  yargs
    .command('list', 'list rotas', () => {}, function () {
      commandList(service, say);
    })
    .command('create <name> [description]', 'create a new rota', (yargs) => {
      yargs.positional('name', {
        type: 'string',
        describe: 'The name of the rota to create'
      });
      yargs.option('description', {
        type: 'string',
        describe: 'An optional description of the rota'
      });
    }, function (argv) {
      commandCreate(service, argv.name, argv.description);
    })
    .parse(text);
};

module.exports = { handle };