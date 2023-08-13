import { Rota } from "../entities/rota";
import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

/**
 * List command
 * 
 * List all rota names in the workspace
 *
 * @param apiService - An instance of the APIService.
 * @param slackAdapter - An instance of the SlackAdapter.
 * @returns A Promise that resolves when command is complete.
 */
export const list = async (apiService: IAPIService, slackAdapter: ISlackAdapter): Promise<void> => {
  try {
    const rotas = await apiService.getRotas();

    if (rotas.length === 0) {
      await slackAdapter.say({
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


      await slackAdapter.say({
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
    await slackAdapter.say(error.message);
  }
};
