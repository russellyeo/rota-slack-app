const { Rota, RotaDescription } = require('../models/rota');
const { User } = require('../models/user');

const axios = require("axios");

class APIService {
  constructor({ baseURL }) {
    this.baseURL = baseURL;
  }

  /**
   * Retrieves a list of rotas from the API.
   * @returns {Promise<Array<Object>>} A Promise that resolves to an array of rotas.
   * @throws {Error} If the API request fails.
   */
  async getRotas() {
    try {
      const response = await axios.get(`${this.baseURL}/api/rotas`);
      return response.data;
    } catch (error) {
      throw new Error(`Could not get rotas. Error: ${error.message}.`);
    }
  }

  /**
  * Retrieves a single rota by name and returns it as a Rota object.
  * @param {string} name - The name of the rota to retrieve.
  * @returns {Promise<Rota>} A Promise that resolves to a Rota object representing the requested rota.
  * @throws {Error} If the request fails or the response is not valid JSON.
  */
  async getRota(name) {
    try {
      const response = await axios.get(`${this.baseURL}/api/rotas/${name}`);
      const rotaDescription = new RotaDescription(
        response.data.rota.name,
        response.data.rota.description
      );
      const rota = new Rota(rotaDescription, response.data.assigned, response.data.users);
      return rota;
    } catch (error) {
      throw new Error(`Could not get \`${name}\` rota. Error: ${error.message}.`);
    }
  }

  /**
    * Create a new rota with name and optional description.
    * @param {string} name - The name of the rota to create.
    * @param {string} description - The description of the rota to create (optional).
    * @returns {Promise<Object>} A Promise that resolves to an Object for the created rota.
    * @throws {Error} If the request fails or the response is not valid JSON.
    */
  async createRota(name, description) {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/rotas`,
        JSON.stringify({ name, description })
      );
      return response.data;
    } catch (error) {
      throw new Error(`Could not create rota \`${name}\`. Error: ${error.message}.`);
    }
  }

  /**
    * Delete a rota.
    * @param {string} name - The name of the rota to delete.
    * @returns {Promise<undefined>} A Promise that resolves to undefined if the deletion was successful.
    * @throws {Error} If the API request fails.
    */
  async deleteRota(name) {
    try {
      const response = await axios.delete(`${this.baseURL}/api/rotas/${name}`);
      return response.data;
    } catch (error) {
      console.log(error.message);
      throw new Error(`Could not delete \`${name}\`. Error: ${error.message}.`);
    }
  }

  /**
    * Add users to a rota.
    * @param {string} name - The name of the rota to add users to.
    * @param {Array<string>} users - An array of the users to add to the rota.
    * @returns {Promise<undefined>} A Promise that resolves to undefined if the request was successful.
    * @throws {Error} If the API request fails.
    */
  async addUsersToRota(name, users) {
    if (users.length === 0) {
      throw new Error("Error: Users must be non-empty.");
    }
    try {
      const response = await axios.post(
        `${this.baseURL}/api/rotas/${name}/users`,
        JSON.stringify({ users })
      );
      return response.data;
    } catch (error) {
      throw new Error(`Could not add users to \`${name}\` rota. Error: ${error.message}.`);
    };
  }

  /**
    * Retrieve a user by name.
    * @param {string} name - The name of the user.
    * @returns {Promise<User>} A Promise that resolves to a User object.
    * @throws {Error} If the API request fails or the response is invalid.
    */
  async getUserByName(name) {
    try {
      const response = await axios.get(`${this.baseURL}/api/users/by-name/${encodeURIComponent(name)}`);
      return new User(response.data.id, response.data.name);
    } catch (error) {
      throw new Error(`Could not get user \`${name}\`. Error: ${error.message}.`);
    }
  }

  /**
    * Update a rota's assigned user.
    * @param {string} rota - The rota to be updated.
    * @param {int} assigned - The ID of the user to assign to the rota.
    * @returns {Promise<undefined>} A Promise that resolves to undefined if the update was successful.
    * @throws {Error} If the API request fails.
    */
  async updateRota(rota, assigned) {
    try {
      await axios.patch(
        `${this.baseURL}/api/rotas/${rota}`,
        JSON.stringify({ assigned }),
      );
      return undefined;
    } catch (error) {
      throw new Error(`Could not update \`${rota}\` rota. Error: ${error.message}.`);
    }
  }

  /**
  * Rotate a rota, updating the assigned user to the next user in the list.
  * @param {string} rota - The name of the rota to rotate.
  * @returns {Promise<Rota>} The updated rota.
  * @throws {Error} If the request fails or the response is not valid JSON.
  */
  async rotateRota(rota) {
    try {
      const response = await axios.get(`${this.baseURL}/api/rotas/${rota}/rotate`);
      const data = response.data;
      const rotaDescription = new RotaDescription(data.rota.name, data.rota.description);
      return new Rota(rotaDescription, data.assigned, data.users);
    } catch (error) {
      throw new Error(`Could not rotate \`${rota}\` rota. Error: ${error.message}.`);
    }
  }

}

module.exports = { APIService };
