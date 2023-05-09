const { Rota, RotaDescription } = require('../models/rota');
const { RotaWithUsers } = require('../models/rota-with-users');
const { User } = require('../models/user');

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
    const url = `${this.baseURL}/api/rotas`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Could not retrieve rotas');
    }
    const data = await response.json();
    return data;
  }

  /**
  * Retrieves a single rota by name and returns it as a Rota object.
  * @param {string} name - The name of the rota to retrieve.
  * @returns {Promise<Rota>} A Promise that resolves to a Rota object representing the requested rota.
  * @throws {Error} If the request fails or the response is not valid JSON.
  */
  async getRota(name) {
    const url = `${this.baseURL}/api/rotas/${name}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Could not retrieve rota');
    }
    try {
      const data = await response.json();
      const rotaDescription = new RotaDescription(data.rota.name, data.rota.description);
      const rota = new Rota(rotaDescription, data.assigned, data.users);
      return rota;
    } catch {
      throw new Error('Could not parse response');
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
    const response = await fetch(`${this.baseURL}/api/rotas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });
    if (!response.ok) {
      throw new Error(`Could not create rota \`${name}\``);
    }
    const responseData = await response.json();
    return responseData;
  }

  /**
    * Delete a rota.
    * @param {string} name - The name of the rota to delete.
    * @returns {Promise<undefined>} A Promise that resolves to undefined if the deletion was successful.
    * @throws {Error} If the API request fails.
    */
  async deleteRota(name) {
    const response = await fetch(`${this.baseURL}/api/rotas/${name}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Could not delete rota \`${name}\``);
    }
    return undefined;
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
      throw new Error("Users must be non-empty");
    }
    const response = await fetch(`${this.baseURL}/api/rotas/${name}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Could not assign users to rota \`${name}\`. ${error.message}`);
    }
    return undefined;
  }

  /**
    * Retrieve a user by name.
    * @param {string} name - The name of the user.
    * @returns {Promise<User>} A Promise that resolves to a User object.
    * @throws {Error} If the API request fails or the response is invalid.
    */
  async getUserByName(name) {
    const response = await fetch(`${this.baseURL}/api/users/by-name/${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Could not get user. ${error.message}`);
    }
    try {
      const data = await response.json();
      return new User(data.id, data.name);
    } catch {
      throw new Error('Could not parse response');
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
    const response = await fetch(`${this.baseURL}/api/rotas/${rota}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assigned }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error: ${error.message}`);
    }
    return undefined;
  }

  /**
  * Rotate a rota, updating the assigned user.
  * @param {string} rota - The name of the rota to rotate.
  * @returns {Promise<RotaWithUsers>} The updated rota.
  * @throws {Error} If the request fails or the response is not valid JSON.
  */
  async rotateRota(rota) {
    const response = await fetch(`${this.baseURL}/api/rotas/${rota}/rotate`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error: ${error.message}`);
    }
    try {
      const data = await response.json();
      const rotaDescription = new RotaDescription(data.rota.name, data.rota.description);
      return new RotaWithUsers(rotaDescription, data.assigned, data.users);
    } catch {
      throw new Error('Could not parse response');
    }
  }

}

module.exports = { APIService };
