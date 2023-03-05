class APIService {
  
  constructor({ baseURL }) {
    this.baseURL = baseURL;
  }

  async getRotas() {
    const url = `${this.baseURL}/api/rotas`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }

}

module.exports = { APIService };