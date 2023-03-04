const yargs = require('yargs');

const parser = yargs
  .command('create <name> [description]', 'create a new rota', (yargs) => {
    yargs.positional('name', {
      type: 'string',
      describe: 'The name of the rota to create',
    });
    yargs.option('description', {
      type: 'string',
      describe: 'An optional description of the rota',
    });
  }, function (argv) {
    console.log("🟠 New rota created", argv.name, argv.description);
  })

module.exports = { parser };