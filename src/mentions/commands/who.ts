import { IAPIService } from "../../infrastructure/api_service";
import { SayFn } from "@slack/bolt";

/**
 * Who command
 * 
 * Fetch a given rota and send a message with the user that is assigned to it.
 *
 * @param service - An instance of the APIService.
 * @param say - The SayFn function from Slack Bolt used to send a message.
 * @param rotaName - The name of the rota.
 * @returns A Promise that resolves when command is complete.
 */
export const who = async (service: IAPIService, say: SayFn, rotaName: string): Promise<void> => {
  try {
    const rota = await service.getRota(rotaName);
    await say(rota.assigned);
  } catch (error: any) {
    await say(error.message);
  }
};