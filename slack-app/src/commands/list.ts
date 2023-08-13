import { RotaDescription } from "../entities/rota";
import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

interface Dependencies {
  apiService: IAPIService;
  slackAdapter: ISlackAdapter;
  errorHandler: (slackAdapter: ISlackAdapter, error: unknown) => Promise<void>;
}

export const ListCommand = {
  make: (dependencies: Dependencies) => {
    /**
     * List command
     * 
     * List all rota names in the workspace
     *
     * @returns A Promise that resolves when the command is complete.
     */
    return async (): Promise<void> => {
      try {
        const rotas = await dependencies.apiService.getRotas();

        if (rotas.length === 0) {
          await dependencies.slackAdapter.say({
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
            .map((rota: RotaDescription) => {
              const description = rota.description ? `- ${rota.description}` : '';
              return `\`${rota.name}\` ${description}`;
            })
            .join('\n');


          await dependencies.slackAdapter.say({
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
      } catch (error: unknown) {
        await dependencies.errorHandler(dependencies.slackAdapter, error);
      }
    };
  }
};