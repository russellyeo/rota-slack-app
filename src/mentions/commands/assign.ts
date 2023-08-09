import { APIService } from "../../services/api_service";
import { User } from "../../models/user";
import { SayFn } from "@slack/bolt";

/**
 * Assign command
 * 
 * Assign a user to a rota and send a message to the user to let them know if it was succesful or not
 *
 * @param service - An instance of the APIService.
 * @param say - The SayFn function from Slack Bolt used to send a message.
 * @param userName - The name of the rota to be created.
 * @param rotaName - (Optional) A description for the rota.
 * @returns A Promise that resolves when command is complete.
 */
export const assign = async (service: APIService, say: SayFn, userName: string, rotaName: string): Promise<void> => {
  try {
    const user: User = await service.getUserByName(userName);
    await service.updateRota(rotaName, user.id);
    await say({
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
    await say(error.message);
  }
};