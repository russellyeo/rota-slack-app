import yargs from 'yargs';

import { APIService } from '../services/api_service';
import { SayFn } from "@slack/bolt";

import { add } from './commands/add';
import { assign } from './commands/assign';
import { create } from './commands/create';
import { deleteCommand } from './commands/delete';
import { help } from './commands/help';
import { list } from './commands/list';
import { rotate } from './commands/rotate';
import { show } from './commands/show';
import { who } from './commands/who';


export const mentionsParser = async (text: string, service: APIService, say: SayFn) => {
  const removeQuotes = (string: string) => string.replace(/"+/g, '');

  const yargsParser = yargs
    .command({
      command: 'list',
      handler: () => {
        list(service, say);
      }
    })
    .command({
      command: 'help',
      handler: () => {
        help(say);
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
        const description = argv.description ? removeQuotes(argv.description) : undefined;
        create(service, say, argv.name, description);
      }
    })
    .command({
      command: 'delete <name>',
      builder: (yargs) => {
        return yargs
          .positional('name', { type: 'string' });
      },
      handler: (argv) => {
        deleteCommand(service, say, argv.name);
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
        add(service, say, argv.name, argv.users);
      }
    })
    .command({
      command: 'show <name>',
      builder: (yargs) => {
        return yargs.positional('name', { type: 'string' });
      },
      handler: (argv) => {
        show(service, say, argv.name);
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
        assign(service, say, argv.user, argv.rota);
      }
    })
    .command({
      command: 'who <rota>',
      builder: (yargs) => {
        return yargs
          .positional('rota', { type: 'string' });
      },
      handler: (argv) => {
        who(service, say, argv.rota);
      }
    })
    .command({
      command: 'rotate <rota>',
      builder: (yargs) => {
        return yargs.positional('rota', { type: 'string' });
      },
      handler: (argv) => {
        rotate(service, say, argv.rota);
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
    await yargsParser.parse(text);
  } catch (error) {
    say("🤔 I'm sorry, I didn't understand that. Please try rephrasing your question or enter `@Rota help` to see a list of available commands.");
  }
};