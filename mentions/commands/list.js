function buildMarkdownList(rotas) {
  const lines = rotas.map((rota) => {
    let line = `\`${rota.name}\` - `;
    if (rota.description) {
      line += `${rota.description}`;
    }
    return line;
  });
  return lines.join('\n');
}

/*
  List
  @Rota list
*/
async function listRotas(service, say) {
  try {
    const rotas = await service.getRotas();
    const string = buildMarkdownList(rotas);

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
              text: string,
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
