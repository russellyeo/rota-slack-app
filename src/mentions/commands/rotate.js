/*
  Rotate
  @Rota rotate <rota-name>
*/
module.exports = async (rotaName, service, say) => {
  try {
    const rota = await service.rotateRota(rotaName);
    await say(`\`${rota.rota.name}\` was rotated. \`${rota.assigned}\` is now the assigned user.`);
  } catch (error) {
    await say(error.message);
  }
};