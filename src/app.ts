
import { App, LogLevel } from '@slack/bolt';
import { APIService } from './infrastructure/api_service';
import { config } from 'dotenv';
import mentions from './mentions';

/** Configure Environment Variables */
config();

/** Initialization */
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: false,
  logLevel: LogLevel.DEBUG,
});
const service = new APIService({
  baseURL: process.env.ROTA_API_URL || '',
});

/** Register Listeners */
mentions.register(app, service);

/** Start Bolt App */
(async () => {
  try {
    await app.start(Number(process.env.PORT || 3000));
    console.log('⚡️ Bolt app is running! ⚡️');
  } catch (error) {
    console.error('Unable to start App', error);
  }
})();