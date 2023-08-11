import { IAPIService } from "../../infrastructure/api_service";
import { SayFn } from "@slack/bolt";

/**
 * Add command
 * 
 * Add users to a rota and send a message to the user to let them know if it was succesful or not
 *
 * @param service - An instance of the APIService.
 * @param say - The SayFn function from Slack Bolt used to send a message.
 * @param rotaName - The name of the rota to be created.
 * @param usernames - The usernames to be added to the rota.
 * @returns A Promise that resolves when command is complete.
 */
export const add = async (service: IAPIService, say: SayFn, rotaName: string, usernames: Array<string>): Promise<void> => {
  try {
    await service.addUsersToRota(rotaName, usernames);
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Successfully assigned users to rota \`${rotaName}\``,
          },
        },
      ],
    });
  } catch (error: any) {
    await say(error.message);
  }
};