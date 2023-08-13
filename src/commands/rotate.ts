import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

/**
 * Rotate command
 * 
 * Rotate the given rota and send a message with the newly assigned user.
 *
 * @param apiService - An instance of the APIService.
 * @param slackAdapter - An instance of the SlackAdapter.
 * @param rotaName - The name of the rota to rotate.
 * @returns A Promise that resolves when command is complete.
 */
export const rotate = async (apiService: IAPIService, slackAdapter: ISlackAdapter, rotaName: string): Promise<void> => {
  try {
    const rota = await apiService.rotateRota(rotaName);
    await slackAdapter.say(`\`${rota.rota.name}\` was rotated. \`${rota.assigned}\` is now the assigned user.`);
  } catch (error: any) {
    await slackAdapter.say(error.message);
  }
};