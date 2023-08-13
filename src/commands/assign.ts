import { User } from "../entities/user";
import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

/**
 * Assign command
 * 
 * Assign a user to a rota and send a message to the user to let them know if it was succesful or not
 *
 * @param apiService - An instance of the APIService.
 * @param slackAdapter - An instance of the SlackAdapter.
 * @param userName - The name of the rota to be created.
 * @param rotaName - (Optional) A description for the rota.
 * @returns A Promise that resolves when command is complete.
 */
export const assign = async (apiService: IAPIService, slackAdapter: ISlackAdapter, userName: string, rotaName: string): Promise<void> => {
  try {
    const user: User = await apiService.getUserByName(userName);
    await apiService.updateRota(rotaName, user.id);
    await slackAdapter.say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Assigned \`${user.name}\` to \`${rotaName}\``
          }
        }
      ]
    });
  } catch (error: any) {
    await slackAdapter.say(error.message);
  }
};