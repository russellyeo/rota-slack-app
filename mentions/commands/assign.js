/*
  Assign
  @Rota assign <user> <rota-name>
*/
module.exports = async (userName, rota, service, say) => {
  try {
    const user = await service.getUserByName(userName);
    await service.updateRota(rota, user.id);
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Assigned \`${user.name}\` to \`${rota}\``
          }
        }
      ]
    });
  } catch (error) {
    await say(error.message);
  }
};