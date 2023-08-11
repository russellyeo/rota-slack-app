import { IAPIService } from "../../infrastructure/api_service";
import { SayFn } from "@slack/bolt";

/**
 * Delete command
 * 
 * Delete a rota and send a message to the user to let them know if it was succesful or not
 *
 * @param service - An instance of the APIService.
 * @param say - The SayFn function from Slack Bolt used to send a message.
 * @param rotaName - The name of the rota to be deleted.
 * @returns A Promise that resolves when command is complete.
 */
export const deleteCommand = async (service: IAPIService, say: SayFn, rotaName: string): Promise<void> => {
  try {
    await service.deleteRota(rotaName);
    await say({
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
    await say(error.message);
  }
};
