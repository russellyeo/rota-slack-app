import { User } from "../entities/user";
import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

interface Dependencies {
  apiService: IAPIService;
  slackAdapter: ISlackAdapter;
  errorHandler: (slackAdapter: ISlackAdapter, error: unknown) => Promise<void>;
}

export const AssignCommand = {
  make: (dependencies: Dependencies) => {
    /**
     * Assign command
     * 
     * Assign a user to a rota and send a message to the user to let them know if it was succesful or not
     *
     * @param userName - The name of the rota to be created.
     * @param rotaName - (Optional) A description for the rota.
     * @returns A Promise that resolves when the command is complete.
     */
    return async (userName: string, rotaName: string): Promise<void> => {
      try {
        const user: User = await dependencies.apiService.getUserByName(userName);
        await dependencies.apiService.updateRota(rotaName, user.id);
        await dependencies.slackAdapter.say({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `Assigned \`${user.name}\` to \`${rotaName}\``
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