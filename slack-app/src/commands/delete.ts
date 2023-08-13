import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

interface Dependencies {
  apiService: IAPIService;
  slackAdapter: ISlackAdapter;
  errorHandler: (slackAdapter: ISlackAdapter, error: unknown) => Promise<void>;
}

export const DeleteCommand = {
  make: (dependencies: Dependencies) => {
    /**
     * Delete command
     * 
     * Delete a rota and send a message to the user to let them know if it was succesful or not
     *
     * @param rotaName - The name of the rota to be deleted.
     * @returns A Promise that resolves when the command is complete.
     */
    return async (rotaName: string): Promise<void> => {
      try {
        await dependencies.apiService.deleteRota(rotaName);
        await dependencies.slackAdapter.say({
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
      } catch (error: unknown) {
        await dependencies.errorHandler(dependencies.slackAdapter, error);
      }
    };
  }
};
