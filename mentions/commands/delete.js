/*
  Delete
  @Rota delete "[rotation-name]"
*/
module.exports = async (name, service, say) => {
  try {
    await service.deleteRota(name);
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Successfully deleted \`${name}\` rota`,
          }
        }
      ]
    });
  } catch (error) {
    await say(error.message);
  }
};
