/*
  Add
  @Rota add [rota-name] [@user1 @user2 @user3]
*/
module.exports = async (name, users, service, say) => {
  try {
    await service.addUsersToRota(name, users);
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Successfully assigned users to rota \`${name}\``,
          }
        }
      ]
    });
  } catch (error) {
    await say(error.message);
  }
};