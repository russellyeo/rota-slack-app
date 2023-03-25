const handler = require('./handler');

module.exports.register = (app, service) => {
  app.event('app_mention', async({ event, say }) => {
    // Clean up input before parsing
    const input = event.text
      .replace(/^<@(U[A-Z0-9]+?)>\s*/, '')
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .trim();

    // Parse and handle input
    handler.handle(input, service, say);
  });
};