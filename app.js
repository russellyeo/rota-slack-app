const { App, LogLevel } = require('@slack/bolt');
const { config } = require('dotenv');
const mentions = require('./mentions');
const { APIService } = require('./services/api_service');

/** Configure Environment Variables */
config();

/** Initialization */
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});
const service = new APIService({
  baseURL: process.env.ROTA_API_URL,
});

/** Register Listeners */
mentions.register(app, service);

/** Start Bolt App */
(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running! ⚡️');
  } catch (error) {
    console.error('Unable to start App', error);
  }
})();
