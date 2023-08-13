import yargs from 'yargs';

import { IAPIService } from '../infrastructure/api_service';
import { ISlackAdapter } from "../infrastructure/slack_adapter";

import { AddCommand } from '../commands/add';
import { AssignCommand } from '../commands/assign';
import { CreateCommand } from '../commands/create';
import { DeleteCommand } from '../commands/delete';
import { HelpCommand } from '../commands/help';
import { ListCommand } from '../commands/list';
import { RotateCommand } from '../commands/rotate';
import { ShowCommand } from '../commands/show';
import { WhoCommand } from '../commands/who';

import { MessageSanitizer } from './message_sanitizer';
import { ErrorHandler } from './error_handler';

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

    // Create the default error handler
    const errorHandler = ErrorHandler.create({ slackAdapter: this.slackAdapter });

    // Create the parser and handlers for each command
    const yargsParser = yargs
      .command({
        command: 'add <name> [users...]',
        builder: (yargs) => {
          return yargs
            .positional('name', { type: 'string' })
            .option('users', { type: 'string' });
        },
        handler: (argv) => {
          const addCommand = AddCommand.make({
            apiService: this.apiService,
            slackAdapter: this.slackAdapter,
            errorHandler: errorHandler
          });
          addCommand(argv.name, argv.users);
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
          const assignCommand = AssignCommand.make({
            apiService: this.apiService,
            slackAdapter: this.slackAdapter,
            errorHandler: errorHandler
          });
          assignCommand(argv.user, argv.rota);
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
          const createCommand = CreateCommand.make({
            apiService: this.apiService,
            slackAdapter: this.slackAdapter,
            errorHandler: errorHandler
          });
          const description = argv.description ? MessageSanitizer.removeQuotes(argv.description) : undefined;
          createCommand(argv.name, description);
        }
      })
      .command({
        command: 'delete <name>',
        builder: (yargs) => {
          return yargs
            .positional('name', { type: 'string' });
        },
        handler: (argv) => {
          const deleteCommand = DeleteCommand.make({
            apiService: this.apiService,
            slackAdapter: this.slackAdapter,
            errorHandler: errorHandler
          });
          deleteCommand(argv.name);
        }
      })
      .command({
        command: 'help',
        handler: () => {
          const helpCommand = HelpCommand.make({
            slackAdapter: this.slackAdapter,
            errorHandler: errorHandler
          });
          helpCommand();
        }
      })
      .command({
        command: 'list',
        handler: () => {
          const listCommand = ListCommand.make({
            apiService: this.apiService,
            slackAdapter: this.slackAdapter,
            errorHandler: errorHandler
          });
          listCommand();
        }
      })
      .command({
        command: 'rotate <rota>',
        builder: (yargs) => {
          return yargs.positional('rota', { type: 'string' });
        },
        handler: (argv) => {
          const rotateCommand = RotateCommand.make({
            apiService: this.apiService,
            slackAdapter: this.slackAdapter,
            errorHandler: errorHandler
          });
          rotateCommand(argv.rota);
        }
      })
      .command({
        command: 'show <name>',
        builder: (yargs) => {
          return yargs.positional('name', { type: 'string' });
        },
        handler: (argv) => {
          const showCommand = ShowCommand.make({
            apiService: this.apiService,
            slackAdapter: this.slackAdapter,
            errorHandler: errorHandler
          });
          showCommand(argv.name);
        }
      })
      .command({
        command: 'who <rota>',
        builder: (yargs) => {
          return yargs
            .positional('rota', { type: 'string' });
        },
        handler: (argv) => {
          const whoCommand = WhoCommand.make({
            apiService: this.apiService,
            slackAdapter: this.slackAdapter,
            errorHandler: errorHandler
          });
          whoCommand(argv.rota);
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