import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

/**
 * Delete command
 * 
 * Delete a rota and send a message to the user to let them know if it was succesful or not
 *
 * @param apiService - An instance of the APIService.
 * @param slackAdapter - An instance of the SlackAdapter.
 * @param rotaName - The name of the rota to be deleted.
 * @returns A Promise that resolves when command is complete.
 */
export const deleteCommand = async (apiService: IAPIService, slackAdapter: ISlackAdapter, rotaName: string): Promise<void> => {
  try {
    await apiService.deleteRota(rotaName);
    await slackAdapter.say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Successfully deleted \`${rotaName}\` rota`,
          }
        }
      ]
    });
  } catch (error: any) {
    await slackAdapter.say(error.message);
  }
};
