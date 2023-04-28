/*
  Create
  @Rota create "[rotation-name]" [optional description]
*/
module.exports = async (name, description, service, say) => {
  try {
    await service.createRota(name, description);
  } catch (error) {
    await say(error.message);
  }
};
