import { APIService } from "../../services/api_service";
import { SayFn } from "@slack/bolt";

/**
 * Show command
 * 
 * Fetch a given rota and send a message with it's details.
 *
 * @param service - An instance of the APIService.
 * @param say - The SayFn function from Slack Bolt used to send a message.
 * @param rotaName - The name of the rota to show.
 * @returns A Promise that resolves when command is complete.
 */
export const show = async (service: APIService, say: SayFn, rotaName: string): Promise<void> => {
  try {
    const rota = await service.getRota(rotaName);

    const assignedInfo = (rota.assigned) ? `Assigned: \`${rota.assigned}\`` : 'No assigned user'
    const usersInfo = (rota.users.length > 0) ? rota.users.map(x => `\`${x}\``) : 'No users in rota'

    await say({
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
    await say(error.message);
  }
};
