const handler = require('./handler');

module.exports.register = (app, service) => {
  app.event('app_mention', async({ event, say }) => {
    // Drop the slack username if present
    const input = event.text.replace(/^<@(U[A-Z0-9]+?)>\s*/, '');

    // Parse and handle input
    handler.handle(input, service, say);
  });
};