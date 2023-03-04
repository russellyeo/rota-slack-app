const { parser } = require('./parser');

module.exports.register = (app) => {
  app.event('app_mention', async({ event, context }) => {
    
    // Drop the slack username if present
    const input = event.text.replace(/^<@(U[A-Z0-9]+?)>\s*/, '');
    console.log(`🟠 Input text: ${clean}`);

    const command = parser.parse(input);
    console.log(command);
  });
};