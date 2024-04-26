import { App, LogLevel } from '@slack/bolt';
import { config } from 'dotenv';

import { APIService } from './infrastructure/api_service';
import { MentionsController } from './interfaces/mentions_controller';
import { SlackAdapter } from './infrastructure/slack_adapter';

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

const apiService = new APIService({
  baseURL: process.env.ROTA_API_URL || '',
});

const slackAdapter = new SlackAdapter();

const mentionsController = new MentionsController({
  apiService: apiService,
  slackAdapter: slackAdapter
});

/** Register event handlers */
app.event('app_mention', async ({ event, say }) => {
  slackAdapter.setSayFn(say);
  mentionsController.handleMention(event.text);
});

/** Start Bolt App */
(async () => {
  try {
    await app.start(Number(process.env.PORT || 3000));
    console.log('⚡️ Bolt app is running! ⚡️');
  } catch (error) {
    console.error('Unable to start App', error);
  }
})();