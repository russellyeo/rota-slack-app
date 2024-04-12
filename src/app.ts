import { App, LogLevel } from '@slack/bolt';
import { config } from 'dotenv';

import { APIService } from './infrastructure/api_service';
import { AuthenticationService } from './infrastructure/authentication_service';
import { MentionsController } from './interfaces/mentions_controller';
import { SlackAdapter } from './infrastructure/slack_adapter';
import axios from 'axios';

/** Configure Environment Variables */
config();

const baseURL = process.env.ROTA_API_URL;
if (!baseURL) {
  throw new Error('ROTA_API_URL is not defined');
}

/** Initialization */

const apiClient = axios.create({ baseURL: baseURL });
apiClient.defaults.headers['Content-Type'] = 'application/json';

const apiService = new APIService({ baseURL: baseURL });

const authenticationService = new AuthenticationService({ apiClient: apiClient });

const slackAdapter = new SlackAdapter();

const mentionsController = new MentionsController({
  apiService: apiService,
  slackAdapter: slackAdapter
});

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.STATE_SECRET,
  scopes: ['app_mentions:read', 'chat:write'],
  logLevel: LogLevel.DEBUG,
  redirectUri: process.env.REDIRECT_URI,
  installationStore: {
    storeInstallation: async (installation) => {
        if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
          try {
            return authenticationService.createEnterpriseInstallation(installation);
          } catch(error) {
            throw new Error(`Failed storing installation for enterprise id ${installation.enterprise.id}. Error: ${error}.`);
          }
        }
        if (installation.team !== undefined) {
          try {
            return authenticationService.createTeamInstallation(installation);
          } catch(error) {
            throw new Error(`Failed storing installation for team id ${installation.team.id}. Error: ${error}.`);
          }
        }
        throw new Error('Failed storing installation');
    },
    fetchInstallation: async (installQuery) => {
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        try {
          return authenticationService.fetchEnterpriseInstallation(installQuery.enterpriseId);
        } catch(error) {
          throw new Error(`Failed fetching installation for enterprise id ${installQuery.enterpriseId}. Error: ${error}.`);
        }
      }
      if (installQuery.teamId !== undefined) {
        try {
          return authenticationService.fetchTeamInstallation(installQuery.teamId);
        } catch(error) {
          throw new Error(`Failed fetching installation for team id ${installQuery.teamId}. Error: ${error}.`);
        }
      }
      throw new Error('Failed fetching installation');
    },
    deleteInstallation: async (installQuery) => {
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        try {
          return authenticationService.deleteEnterpriseInstallation(installQuery.enterpriseId);
        } catch(error) {
          throw new Error(`Failed deleting installation for enterprise id ${installQuery.enterpriseId}. Error: ${error}.`);
        }
      }
      if (installQuery.teamId !== undefined) {
        try {
          return authenticationService.deleteTeamInstallation(installQuery.teamId);
        } catch(error) {
          throw new Error(`Failed deleting installation for team id ${installQuery.enterpriseId}. Error: ${error}.`);
        }
      }
      throw new Error('Failed to delete installation');
    },
  },
  installerOptions: {
    authVersion: "v2",
    directInstall: true,
    installPath: "/slack/install",
    redirectUriPath: "/slack/oauth_redirect",
    stateVerification: false,
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