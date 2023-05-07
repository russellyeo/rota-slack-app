/*
  Assign
  @Rota assign <user> <rota-name>
*/
module.exports = async (user, rota, service, say) => {
  try {
    await service.assignUserToRota(user, rota);
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Assigned \`${user}\` to \'${rota}\'`
          }
        }
      ]
    });
  } catch (error) {
    await say(error.message);
  }
};