/* 
  List
  @Rota list
*/
module.exports = async (service, say) => {
  try {
    const rotas = await service.getRotas();
    const string = buildMarkdownList(rotas);
    await say({
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Your current rotas*"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": string
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Try `@Rota help` for to see a list of possible commands"
          }
        },
      ]
    });
  }
  catch (error) {
    console.log("🔴 Error: could not get rotas");
  }
};

function buildMarkdownList(rotas) {
  const lines = rotas.map(rota => {
    let line = `\`${rota.name}\` - `;
    if (rota.description) {
      line += `${rota.description}`;
    }
    return line;
  });
  return lines.join('\n');
};