import { IAPIService } from "../infrastructure/api_service";
import { ISlackAdapter } from "../infrastructure/slack_adapter";

/**
 * Who command
 * 
 * Fetch a given rota and send a message with the user that is assigned to it.
 *
 * @param apiService - An instance of the APIService.
 * @param slackAdapter - An instance of the SlackAdapter.
 * @param rotaName - The name of the rota.
 * @returns A Promise that resolves when command is complete.
 */
export const who = async (apiService: IAPIService, slackAdapter: ISlackAdapter, rotaName: string): Promise<void> => {
  try {
    const rota = await apiService.getRota(rotaName);
    await slackAdapter.say(rota.assigned);
  } catch (error: any) {
    await slackAdapter.say(error.message);
  }
};