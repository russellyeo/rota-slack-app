const { mentionCallback } = require('./mention');

module.exports.register = (app) => {
  app.event('app_mention', mentionCallback);
};
