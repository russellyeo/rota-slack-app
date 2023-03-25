class APIService {
  
  constructor({ baseURL }) {
    this.baseURL = baseURL;
  }

  async getRotas() {
    const url = `${this.baseURL}/api/rotas`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Could not retrieve rotas");
    }
    const data = await response.json();
    return data;
  }

  async createRota(name, description) {
    const response = await fetch(`${this.baseURL}/api/rotas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, description })
    });
    if (!response.ok) {
      throw new Error("Could not create rota");
    }
    const responseData = await response.json();
    return responseData;
  }

}

module.exports = { APIService };