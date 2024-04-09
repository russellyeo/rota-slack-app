import { App, LogLevel } from '@slack/bolt';
import { FileInstallationStore } from '@slack/oauth';
import { config } from 'dotenv';

import { APIService } from './infrastructure/api_service';
import { MentionsController } from './interfaces/mentions_controller';
import { SlackAdapter } from './infrastructure/slack_adapter';

/** Configure Environment Variables */

config();

const baseURL = process.env.ROTA_API_URL;
if (!baseURL) {
  throw new Error('ROTA_API_URL is not defined');
}

/** Initialization */

const apiService = new APIService({
  baseURL: baseURL
});

const slackAdapter = new SlackAdapter();

const mentionsController = new MentionsController({
  apiService: apiService,
  slackAdapter: slackAdapter
});

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  scopes: ['app_mentions:read', 'chat:write'],
  logLevel: LogLevel.DEBUG,
  installationStore: new FileInstallationStore(),
  installerOptions: {
    directInstall: true
  }
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