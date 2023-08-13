# @Rota Slack Bot

A slack bot that helps you to manage your team's rotas. For example, you could set up a daily reminder of who's turn it is to run standup. The bot uses slack [app mentions](https://api.slack.com/events/app_mention) so that it can be invoked from a slackbot reminder to schedule events.

```
@Rota create my-team-standup
@Rota add my-team-standup @user1 @user2 @user3
@Rota assign @user1 my-team-standup

/remind #my-team-standup @Rota who my-team-standup every weekday at 9:20
/remind #my-team-standup @Rota rotate my-team-standup every weekday at 9:45
```

## Commands
- 🎨  `@Rota create [rota-name] "[optional rota description]"` create a new rota. `[rota-name]` can only contain lowercase letters, numbers, and hyphens. `"[optional rota description]"` must be enclosed in double quotes if given.
- ⛔  `@Rota delete [rota-name]` delete a rota.
- 📋  `@Rota list` display a list of all rotas.
- 👀  `@Rota show [rota-name]` show info about a rota.
- 👥  `@Rota add [rota-name] [user1 user2 user3]` add users to a rota.
- 🙋‍♀️  `@Rota assign [user] [rota-name]` assign user to rota.
- 🔄  `@Rota rotate [rota-name]` rotate a rota.
- 🔔  `@Rota who [rota-name]` who is assigned to a rota.
- 💁  `@Rota help` show this list of commands.

## Implementation
- The bot is written in JavaScript using the [bolt-js](https://github.com/slackapi/bolt-js) framework (and the [starter template](https://github.com/slack-samples/bolt-js-starter-template))
- Uses the [Events API](https://api.slack.com/events-api) to receive events from Slack, via the `app_mention` event with `app_mentions:read` permissions.
- Uses the [yargs](https://github.com/yargs/yargs-parser) parsing library to parse commands from the message text.
- Makes outbound requests to a hosted scala API backed by a postgres DB to store and retrieve rota information. See [rota-api](https://github.com/RussellYeo/rota-api).
- Uses the [Slack Web API](https://api.slack.com/web) to send messages, via the `say` function with `chat:write` permissions.


## Development
```shell
# Install dependencies
npm install

# Run the app
npm start

# (optional) expose an ngrok tunnel to your local machine
ngrok http 3000 --oauth github
```

## Notes
- Authorization/authentication has not yet been implemented (both client-side and server-side), so the bot has not yet been published on the slack app store, and will currently only work in workspaces that have installed the app manually.