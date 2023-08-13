import yargs from 'yargs';

import { IAPIService } from '../infrastructure/api_service';
import { ISlackAdapter } from "../infrastructure/slack_adapter";

import { add } from '../commands/add';
import { assign } from '../commands/assign';
import { create } from '../commands/create';
import { deleteCommand } from '../commands/delete';
import { help } from '../commands/help';
import { list } from '../commands/list';
import { rotate } from '../commands/rotate';
import { show } from '../commands/show';
import { who } from '../commands/who';

import { MessageSanitizer } from './message_sanitizer';

interface IMentionsController {
  /**
   * Handle a mention, by parsing the text and invoking the correct command.
   * 
   * @param text - The text of the mention. (e.g. `@Rota create my-rota`)
   * @returns A Promise that resolves when the command is complete.
   */
  handleMention: (text: string) => Promise<void>;
}

class MentionsController implements IMentionsController {
  private apiService: IAPIService;
  private slackAdapter: ISlackAdapter;

  constructor({ apiService, slackAdapter }: { apiService: IAPIService, slackAdapter: ISlackAdapter }) {
    this.apiService = apiService;
    this.slackAdapter = slackAdapter;
  }

  async handleMention(text: string): Promise<void> {
    // Sanitize the input
    const input = MessageSanitizer.clean(text);

    // Create the parser and handlers for each command
    const yargsParser = yargs
      .command({
        command: 'list',
        handler: () => {
          list(this.apiService, this.slackAdapter);
        }
      })
      .command({
        command: 'help',
        handler: () => {
          help(this.slackAdapter);
        }
      })
      .command({
        command: 'create <name> [description]',
        builder: (yargs) => {
          return yargs
            .positional('name', { type: 'string' })
            .option('description', { type: 'string' });
        },
        handler: (argv) => {
          const description = argv.description ? MessageSanitizer.removeQuotes(argv.description) : undefined;
          create(this.apiService, this.slackAdapter, argv.name, description);
        }
      })
      .command({
        command: 'delete <name>',
        builder: (yargs) => {
          return yargs
            .positional('name', { type: 'string' });
        },
        handler: (argv) => {
          deleteCommand(this.apiService, this.slackAdapter, argv.name);
        }
      })
      .command({
        command: 'add <name> [users...]',
        builder: (yargs) => {
          return yargs
            .positional('name', { type: 'string' })
            .option('users', { type: 'string' });
        },
        handler: (argv) => {
          add(this.apiService, this.slackAdapter, argv.name, argv.users);
        }
      })
      .command({
        command: 'show <name>',
        builder: (yargs) => {
          return yargs.positional('name', { type: 'string' });
        },
        handler: (argv) => {
          show(this.apiService, this.slackAdapter, argv.name);
        }
      })
      .command({
        command: 'assign <user> <rota>',
        builder: (yargs) => {
          return yargs
            .positional('user', { type: 'string' })
            .positional('rota', { type: 'string' });
        },
        handler: (argv) => {
          assign(this.apiService, this.slackAdapter, argv.user, argv.rota);
        }
      })
      .command({
        command: 'who <rota>',
        builder: (yargs) => {
          return yargs
            .positional('rota', { type: 'string' });
        },
        handler: (argv) => {
          who(this.apiService, this.slackAdapter, argv.rota);
        }
      })
      .command({
        command: 'rotate <rota>',
        builder: (yargs) => {
          return yargs.positional('rota', { type: 'string' });
        },
        handler: (argv) => {
          rotate(this.apiService, this.slackAdapter, argv.rota);
        }
      })
      .command({
        command: '*',
        handler: () => {
          throw new Error('Unknown command')
        }
      })
      .help(false)
      .fail(false)

    try {
      await yargsParser.parse(input);
    } catch (error) {
      this.slackAdapter.say("🤔 I'm sorry, I didn't understand that. Please try rephrasing your question or enter `@Rota help` to see a list of available commands.");
    }
  }
};

export { IMentionsController, MentionsController }