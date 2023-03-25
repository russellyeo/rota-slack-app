/* 
  Create
  @Rota create "[rotation-name]" [optional description]
*/
module.exports = async (service, name, description) => {
  try {
    service.createRota(name, description);
  }
  catch (error) {
    console.log("🔴 Error: could not create rota:", name, description);
  }
};