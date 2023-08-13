import { ISlackAdapter } from "../infrastructure/slack_adapter";

interface Dependencies {
  slackAdapter: ISlackAdapter;
}

export const ErrorHandler = {
  create: ({ slackAdapter }: Dependencies) => {
    return async (error: unknown): Promise<void> => {
      if (error instanceof Error) {
        await slackAdapter.say(error.message);
      } else {
        await slackAdapter.say("🤔 I'm sorry, I didn't understand that. Please try rephrasing your question or enter `@Rota help` to see a list of available commands.");
      }
    };
  }
}