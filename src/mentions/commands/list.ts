import { APIService } from "../../services/api_service";
import { Rota } from "../../models/rota";
import { SayFn } from "@slack/bolt";

/**
 * List command
 * 
 * List all rota names in the workspace
 *
 * @param service - An instance of the APIService.
 * @param say - The SayFn function from Slack Bolt used to send a message.
 * @returns A Promise that resolves when command is complete.
 */
export const list = async (service: APIService, say: SayFn): Promise<void> => {
  try {
    const rotas = await service.getRotas();

    if (rotas.length === 0) {
      await say({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'You currently have no rotas in your workspace. Try `@Rota help` for to see a list of possible commands.',
            }
          }
        ]
      });
    } else {
      const list = rotas
        .map((rota: Rota) => {
          if (rota && rota.rota) {
            const description = rota.rota.description ? ` - ${rota.rota.description}` : '';
            return `\`${rota.rota.name}\`${description}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n');


      await say({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Rotas in your workspace*',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: list,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Try `@Rota help` for to see a list of possible commands',
            },
          }
        ]
      });
    }
  } catch (error: any) {
    await say(error.message);
  }
};
