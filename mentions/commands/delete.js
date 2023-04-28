/*
  Delete
  @Rota delete "[rotation-name]"
*/
module.exports = async (name, service, say) => {
  try {
    await service.deleteRota(name);
  } catch (error) {
    await say(error.message);
  }
};
