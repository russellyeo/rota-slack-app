import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

/**
 * Show command
 * 
 * Fetch a given rota and send a message with it's details.
 *
 * @param apiService - An instance of the APIService.
 * @param slackAdapter - An instance of the SlackAdapter.
 * @param rotaName - The name of the rota to show.
 * @returns A Promise that resolves when command is complete.
 */
export const show = async (apiService: IAPIService, slackAdapter: ISlackAdapter, rotaName: string): Promise<void> => {
  try {
    const rota = await apiService.getRota(rotaName);

    const assignedInfo = (rota.assigned) ? `Assigned: \`${rota.assigned}\`` : 'No assigned user'
    const usersInfo = (rota.users.length > 0) ? rota.users.map(x => `\`${x}\``) : 'No users in rota'

    await slackAdapter.say({
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
  } catch (error: any) {
    await slackAdapter.say(error.message);
  }
};
