import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

interface Dependencies {
  apiService: IAPIService;
  slackAdapter: ISlackAdapter;
  errorHandler: (slackAdapter: ISlackAdapter, error: unknown) => Promise<void>;
}

export const AddCommand = {
  make: (dependencies: Dependencies) => {
    /**
     * Add command
     * 
     * Add users to a rota and send a message to the user to let them know if it was succesful or not
     *
     * @param rotaName - The name of the rota to be created.
     * @param usernames - The usernames to be added to the rota.
     * @returns A Promise that resolves when the command is complete.
     */
    return async (rotaName: string, usernames: Array<string>): Promise<void> => {
      try {
        await dependencies.apiService.addUsersToRota(rotaName, usernames);
        await dependencies.slackAdapter.say({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `Successfully assigned users rota \`${rotaName}\``,
              },
            },
          ],
        });
      } catch (error: unknown) {
        await dependencies.errorHandler(dependencies.slackAdapter, error);
      }
    };
  }
};