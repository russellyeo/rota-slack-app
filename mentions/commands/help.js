/*
  Help
  @Rota help
*/
module.exports = async (say) => {
  try {
    await say(
      {
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Available commands:*"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": ":art:  `@Rota create [rota-name] \"[optional rota description]\"` *create a new rota*. `[rota-name]` can only contain lowercase letters, numbers, and hyphens. `\"[optional rota description]\"` must be enclosed in double quotes if given."
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": ":no_entry:  `@Rota delete [rota-name]` *delete a rota*."
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": ":clipboard:  `@Rota list` *display a list* of all rotas."
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": ":eyes:  `@Rota show [rota-name]` *show info about a rota*"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": ":busts_in_silhouette:  `@Rota add [rota-name] [user1 user2 user3]` *assign users to a rota*."
            }
          }
        ]
      }
    );
  } catch (error) {
    await say(error.message);
  }
};
