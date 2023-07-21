const utils = require('./utils');
const parse = require('./parse');

module.exports.register = (app, service) => {
  app.event('app_mention', async ({ event, say }) => {
    // Clean up message text so it can be parsed
    const input = utils.clean(event.text);
    // Parse and handle the message
    parse(input, service, say);
  });
};
