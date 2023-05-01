/*
  Create
  @Rota create "[rotation-name]" "[optional description]"
*/
module.exports = async (name, description, service, say) => {
  try {
    await service.createRota(name, description);
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Successfully created \`${name}\` rota`,
          }
        }
      ]
    });
  } catch (error) {
    await say(error.message);
  }
};
