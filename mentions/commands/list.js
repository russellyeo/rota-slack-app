/* 
  List
  @Rota list
*/
module.exports = async (service, say) => {
  try {
    const rotas = await service.getRotas();
    console.log("🟠 Got rotas:", rotas);
    const string = buildMarkdownString(rotas);
    await say({
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": string
          }
        }
      ]
    });
  }
  catch (error) {
    console.log("🔴 Error: could not get rotas");
  }
};

function buildMarkdownString(rotas) {
  let string = 'Rotas:\n';
  rotas.forEach(rota => {
    string += `- ${rota.name}: `;
    if (rota.description) {
      string += `${rota.description}\n`;
    }
    string += '\n';
  });
  return string;
};