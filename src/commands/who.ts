import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

interface Dependencies {
  apiService: IAPIService;
  slackAdapter: ISlackAdapter;
  errorHandler: (error: unknown) => Promise<void>;
}

export const WhoCommand = {
  make: (dependencies: Dependencies) => {
    /**
     * Who command
     * 
     * Fetch a given rota and send a message with the user that is assigned to it.
     *
     * @param rotaName - The name of the rota.
     * @param handoff - The handoff message to send (optional).
     * @returns A Promise that resolves when the command is complete.
     */
    return async (rotaName: string, handoff?: string): Promise<void> => {
      try {
        const rota = await dependencies.apiService.getRota(rotaName);
        const message = handoff ? `${rota.assigned} ${handoff}` : `${rota.assigned}`;
        await dependencies.slackAdapter.say(message);
      } catch (error: unknown) {
        await dependencies.errorHandler(error);
      }
    };
  }
};
