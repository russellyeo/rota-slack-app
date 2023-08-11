import { IAPIService } from "../../infrastructure/api_service";
import { SayFn } from "@slack/bolt";

/**
 * Rotate command
 * 
 * Rotate the given rota and send a message with the newly assigned user.
 *
 * @param service - An instance of the APIService.
 * @param say - The SayFn function from Slack Bolt used to send a message.
 * @param rotaName - The name of the rota to rotate.
 * @returns A Promise that resolves when command is complete.
 */
export const rotate = async (service: IAPIService, say: SayFn, rotaName: string): Promise<void> => {
  try {
    const rota = await service.rotateRota(rotaName);
    await say(`\`${rota.rota.name}\` was rotated. \`${rota.assigned}\` is now the assigned user.`);
  } catch (error: any) {
    await say(error.message);
  }
};