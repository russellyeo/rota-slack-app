const mentionCallback = async ({ event, context, client, say }) => {
  try {
    const response = await fetch(`${process.env.ROTA_API_URL}/api/rotas`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const rotas = await response.json();
    let string = buildMarkdownString(rotas);
    say({
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
  } catch (error) {
    say(`Error while fetching rota data: ${error}`);
    console.error(error);
  }
};

const buildMarkdownString = (rotas) => {
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

module.exports = { mentionCallback };
