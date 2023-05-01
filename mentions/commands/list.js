/*
  List
  @Rota list
*/
async function listRotas(service, say) {
  try {
    const rotas = await service.getRotas();

    if (rotas.length === 0) {
      await say({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'You currently have no rotas in your workspace. Try `@Rota help` for to see a list of possible commands.',
            }
          }
        ]
      });
    } else {
      const list = rotas.map((rota) => {
        const description = rota.description ? ` - ${rota.description}` : '';
        return `\`${rota.name}\`${description}`;
      }).join('\n');

      await say({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Rotas in your workspace*',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: list,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Try `@Rota help` for to see a list of possible commands',
            },
          }
        ]
      });
    }
  } catch (error) {
    await say(error.message);
  }
}

module.exports = listRotas;
