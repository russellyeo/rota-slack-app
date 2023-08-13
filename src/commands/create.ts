import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

/**
 * Create command
 * 
 * Create a rota and send a message to the user to let them know if it was succesful or not
 *
 * @param apiService - An instance of the APIService.
 * @param slackAdapter - An instance of the SlackAdapter.
 * @param name - The name of the rota to be created.
 * @param description - (Optional) A description for the rota.
 * @returns A Promise that resolves when command is complete.
 */
export const create = async (apiService: IAPIService, slackAdapter: ISlackAdapter, rotaName: string, rotaDescription?: string): Promise<void> => {
  try {
    await apiService.createRota(rotaName, rotaDescription);
    await slackAdapter.say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Successfully created \`${rotaName}\` rota`,
          }
        }
      ]
    });
  } catch (error: any) {
    await slackAdapter.say(error.message);
  }
};
