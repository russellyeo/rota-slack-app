import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

interface Dependencies {
  apiService: IAPIService;
  slackAdapter: ISlackAdapter;
  errorHandler: (error: unknown) => Promise<void>;
}

export const RotateCommand = {
  make: (dependencies: Dependencies) => {
    /**
     * Rotate command
     * 
     * Rotate the given rota and send a message with the newly assigned user.
     *
     * @param rotaName - The name of the rota to rotate.
     * @returns A Promise that resolves when the command is complete.
     */
    return async (rotaName: string): Promise<void> => {
      try {
        const rota = await dependencies.apiService.rotateRota(rotaName);
        await dependencies.slackAdapter.say(`\`${rota.rota.name}\` was rotated. \`${rota.assigned}\` is now the assigned user.`);
      } catch (error: unknown) {
        await dependencies.errorHandler(error);
      }
    };
  }
};