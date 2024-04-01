# Rota Slack Bot

A slack bot to help you manage your team's rotas.

## Usage
Say for example, that you have a team standup every weekday at 9:30, you could create a rota with the following commands:
```
@Rota create my-team-standup
@Rota add my-team-standup @user1 @user2 @user3
@Rota assign @user1 my-team-standup
```

The bot can then be invoked by the reminders slackbot command to schedule common operations:
```
/remind #my-team-channel @Rota who my-team-standup every weekday at 9:20
/remind #my-team-channel @Rota rotate my-team-standup every weekday at 9:45
```
You may want to schedule these operations from a separate channel (e.g. `#rota-integration`) to reduce the noise in your team channel.

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
- The app is written in Typescript using the [bolt-js](https://github.com/slackapi/bolt-js) framework.
- Uses the [Events API](https://api.slack.com/events-api) to receive events from Slack, via the `app_mention` event with `app_mentions:read` permissions.
- Uses the [Slack Web API](https://api.slack.com/web) to send messages, via the `say` function with `chat:write` permissions.
- Uses the [yargs](https://github.com/yargs/yargs-parser) parsing library to parse commands from the message text.
- Makes outbound requests to the hosted API, see [rota-api](https://github.com/russellyeo/rota-api) for more info.

## Development

### Prerequisites
- [node.js](https://nodejs.org/en) (v18.x)

### Run
```shell
# Install dependencies
npm install

# Run the app
npm start

# Run tests
npm test

# (optional) expose an ngrok tunnel to your local machine
ngrok http 3000
```

### Deploy
```shell
fly deploy
```

## Notes
- Authorization/authentication has not yet been implemented (both client-side and server-side), so the bot has not yet been published on the slack app store, and will currently only work in workspaces that have installed the app manually.