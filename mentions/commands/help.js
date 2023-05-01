/*
  Help
  @Rota help
*/
module.exports = async (say) => {
  try {
    console.log("[TEST] SAY");
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
              "text": ":sparkle: `@Rota create \"[rota-name]\" \"[optional rota description]\"` *create a new rota*. `[rota-name]` can only contain lowercase letters, numbers, and hyphens."
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": ":no_entry: `@Rota delete \"[rota-name]\"` *delete a rota*."
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": ":clipboard: `@Rota list` *display a list* of all rotas."
            }
          }
        ]
      }
    );
  } catch (error) {
    await say(error.message);
  }
};
