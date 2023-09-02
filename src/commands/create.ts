import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

interface Dependencies {
  apiService: IAPIService;
  slackAdapter: ISlackAdapter;
  errorHandler: (error: unknown) => Promise<void>;
}

export const CreateCommand = {
  make: (dependencies: Dependencies) => {
    /**
     * Create command
     * 
     * Create a rota and send a message to the user to let them know if it was succesful or not
     *
     * @param name - The name of the rota to be created.
     * @param description - (Optional) A description for the rota.
     * @returns A Promise that resolves when the command is complete.
     */
    return async (rotaName: string, rotaDescription?: string): Promise<void> => {
      try {
        await dependencies.apiService.createRota(rotaName, rotaDescription);
        await dependencies.slackAdapter.say({
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
      } catch (error: unknown) {
        await dependencies.errorHandler(error);
      }
    };
  }
};
