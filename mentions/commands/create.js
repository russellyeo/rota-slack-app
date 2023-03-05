/* 
  Create
  @Rota create "[rotation-name]" [optional description]
*/
module.exports = async (service, name, description) => {
  try {
    console.log("🟠 New rota to be created", name, description);
  }
  catch (error) {
    console.log("🔴 Error: could not create rota:", name, description);
  }
};