import { ISlackAdapter } from "../infrastructure/slack_adapter";

interface Dependencies {
  slackAdapter: ISlackAdapter;
  errorHandler: (error: unknown) => Promise<void>;
}

export const SayCommand = {
  make: (dependencies: Dependencies) => {
    /**
     * Say command
     * 
     * Repeats the input back to the user. Just for fun.
     *
     * @returns A Promise that resolves when the command is complete.
     */
    return async (input: String): Promise<void> => {
      try {
        await dependencies.slackAdapter.say(`${input}`);
      } catch (error: unknown) {
        await dependencies.errorHandler(error);
      }
    };
  }
};
