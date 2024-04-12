import { App, LogLevel } from '@slack/bolt';
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
  baseURL: baseURL,
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
  installationStore: {
    storeInstallation: async (installation) => {
      // TODO: change the code below so it saves to your database
      if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
        // support for org wide app installation
        // return await database.set(installation.enterprise.id, installation);
        throw new Error(`Unimplemented: save enterprise installation id ${installation.enterprise.id}`);
      }
      if (installation.team !== undefined) {
        // single team app installation
        // return await database.set(installation.team.id, installation);
        throw new Error(`Unimplemented: save team installation id ${installation.team.id}`);
      }
      throw new Error('Failed saving installation data to installationStore');
    },
    fetchInstallation: async (installQuery) => {
      // TODO: change the code below so it fetches from your database
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        // org wide app installation lookup
        // return await database.get(installQuery.enterpriseId);
        throw new Error(`Unimplemented: fetch org installation id for ${installQuery.enterpriseId}`);
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation lookup
        // return await database.get(installQuery.teamId);
        throw new Error(`Unimplemented: fetch team installation id for ${installQuery.teamId}`);
      }
      throw new Error('Failed fetching installation');
    },
    deleteInstallation: async (installQuery) => {
      // TODO: change the code below so it deletes from your database
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        // org wide app installation deletion
        // return await database.delete(installQuery.enterpriseId);
        throw new Error(`Unimplemented: delete org installation id for ${installQuery.enterpriseId}`);
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation deletion
        // return await database.delete(installQuery.teamId);
        throw new Error(`Unimplemented: delete team installation id for ${installQuery.teamId}`);
      }
      throw new Error('Failed to delete installation');
    },
  },
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