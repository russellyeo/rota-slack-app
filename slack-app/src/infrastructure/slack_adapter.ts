import { SayFn, SayArguments } from '@slack/bolt';

interface ISlackAdapter {
  say: (message: string | SayArguments) => Promise<unknown>;
  setSayFn: (sayFn: SayFn) => void;
}

class SlackAdapter implements ISlackAdapter {
  private sayFn?: SayFn;

  setSayFn(sayFn: SayFn) {
    this.sayFn = sayFn;
  }

  async say(message: string | SayArguments): Promise<unknown> {
    if (!this.sayFn) {
      throw new Error('sayFn has not been set');
    }
    try {
      const response = await this.sayFn(message);
      return response;
    } catch (error) {
      console.error('Error sending message to Slack', error);
      throw error;
    }
  }
};

export { ISlackAdapter, SlackAdapter };