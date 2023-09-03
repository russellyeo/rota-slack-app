import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

interface Dependencies {
  apiService: IAPIService;
  slackAdapter: ISlackAdapter;
  errorHandler: (error: unknown) => Promise<void>;
}

export const RemoveUserCommand = {
  make: (dependencies: Dependencies) => {
    /**
     * Remove user from rota command
     * 
     * Remove a user from a rotas and send a message to the user to let them know if it was succesful or not
     *
     * @param rotaName - The name of the rota to delete a user from.
     * @param userName - The name of the user to be deleted.
     * @returns A Promise that resolves when the command is complete.
     */
    return async (rotaName: string, userName: string): Promise<void> => {
      try {
        await dependencies.apiService.removeUserFromRota(rotaName, userName);
        await dependencies.slackAdapter.say({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `Successfully removed \`${userName}\` from \`${rotaName}\``,
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
