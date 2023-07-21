/*
  Show
  @Rota show [rotation-name]
*/
module.exports = async (name, service, say) => {
  try {
    const rota = await service.getRota(name);

    const assignedInfo = (rota.assigned) ? `Assigned: \`${rota.assigned}\`` : 'No assigned user'
    const usersInfo = (rota.users.length > 0) ? rota.users.map(x => `\`${x}\``) : 'No users in rota'

    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:clipboard:  Rota: \`${rota.rota.name}\``,
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:bust_in_silhouette:  ${assignedInfo}`,
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:busts_in_silhouette:  ${usersInfo}`,
          }
        }
      ]
    });
  } catch (error) {
    await say(error.message);
  }
};
