import { App } from '@slack/bolt';
import { APIService } from '../services/api_service';
import { utils } from './utils';
import { mentionsParser } from './parse';

const register = (app: App, service: APIService) => {
  app.event('app_mention', async ({ event, say }) => {
    // Clean up message text so it can be parsed
    const input = utils.clean(event.text);
    // Parse and handle the message
    mentionsParser(input, service, say);
  });
};

export default { register };