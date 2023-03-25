const utils = require('./utils');
const handler = require('./handler');

module.exports.register = (app, service) => {
  app.event('app_mention', async({ event, say }) => {
    // Clean up message text so it can be parsed
    const input = utils.clean(event.text);
    // Handle the message
    handler.handle(input, service, say);
  });
};