import { IAPIService } from "../../services/api_service";
import { SayFn } from "@slack/bolt";

/**
 * Create command
 * 
 * Create a rota and send a message to the user to let them know if it was succesful or not
 *
 * @param service - An instance of the APIService.
 * @param say - The SayFn function from Slack Bolt used to send a message.
 * @param name - The name of the rota to be created.
 * @param description - (Optional) A description for the rota.
 * @returns A Promise that resolves when command is complete.
 */
export const create = async (service: IAPIService, say: SayFn, rotaName: string, rotaDescription?: string): Promise<void> => {
  try {
    await service.createRota(rotaName, rotaDescription);
    await say({
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
    await say(error.message);
  }
};
