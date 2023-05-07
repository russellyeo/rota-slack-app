const { Rota, RotaDescription } = require('../models/rota');

class APIService {
  constructor({ baseURL }) {
    this.baseURL = baseURL;
  }

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

  async addUsersToRota(name, users) {
    const response = await fetch(`${this.baseURL}/api/rotas/${name}`, {
      method: 'PATCH',
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

}

module.exports = { APIService };
