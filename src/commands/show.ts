import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

interface Dependencies {
  apiService: IAPIService;
  slackAdapter: ISlackAdapter;
  errorHandler: (slackAdapter: ISlackAdapter, error: unknown) => Promise<void>;
}

export const ShowCommand = {
  make: (dependencies: Dependencies) => {
    /**
     * Show command
     * 
     * Fetch a given rota and send a message with it's details.
     *
     * @param rotaName - The name of the rota to show.
     * @returns A Promise that resolves when the command is complete.
     */
    return async (rotaName: string): Promise<void> => {
      try {
        const rota = await dependencies.apiService.getRota(rotaName);

        const assignedInfo = (rota.assigned) ? `Assigned: \`${rota.assigned}\`` : 'No assigned user'
        const usersInfo = (rota.users.length > 0) ? rota.users.map(x => `\`${x}\``) : 'No users in rota'

        await dependencies.slackAdapter.say({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `:clipboard:  Rota: \`${rota.rota.name}\``,
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `:bust_in_silhouette:  ${assignedInfo}`,
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `:busts_in_silhouette:  ${usersInfo}`,
              }
            }
          ]
        });
      } catch (error: unknown) {
        await dependencies.errorHandler(dependencies.slackAdapter, error);
      }
    };
  }
}