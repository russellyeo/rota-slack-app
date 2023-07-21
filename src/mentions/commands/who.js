/*
  Who
  @Rota who <rota-name>
*/
module.exports = async (rotaName, service, say) => {
  try {
    const rota = await service.getRota(rotaName);
    await say(rota.assigned);
  } catch (error) {
    await say(error.message);
  }
};