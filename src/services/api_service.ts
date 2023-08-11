import axios from "axios";
import { Rota, RotaDescription } from "../models/rota";
import { User } from "../models/user";

interface IAPIService {
  getRotas(): Promise<Array<Rota>>;
  getRota(name: string): Promise<Rota>;
  createRota(name: string, description?: string): Promise<RotaDescription>;
  deleteRota(name: string): Promise<undefined>;
  addUsersToRota(name: string, users: Array<string>): Promise<undefined>;
  getUserByName(name: string): Promise<User>;
  updateRota(rota: string, assigned: number): Promise<undefined>;
  rotateRota(rota: string): Promise<Rota>;
}

class APIService implements IAPIService {
  private baseURL: string;

  constructor({ baseURL }: { baseURL: string }) {
    this.baseURL = baseURL;
  }

  /**
   * Retrieves a list of rotas from the API.
   * @returns {Promise<Array<Rota>>} A Promise that resolves to an array of rotas.
   * @throws {Error} If the API request fails.
   */
  async getRotas(): Promise<Array<Rota>> {
    try {
      const response = await axios.get<Array<Rota>>(
        `${this.baseURL}/api/rotas`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Could not get rotas. Error: ${(error as Error).message}.`);
    }
  }

  /**
   * Retrieves a single rota by name and returns it as a Rota object.
   * @param {string} name - The name of the rota to retrieve.
   * @returns {Promise<Rota>} A Promise that resolves to a Rota object representing the requested rota.
   * @throws {Error} If the request fails or the response is not valid JSON.
   */
  async getRota(name: string): Promise<Rota> {
    try {
      const response = await axios.get<Rota>(
        `${this.baseURL}/api/rotas/${name}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Could not get \`${name}\` rota. Error: ${(error as Error).message}.`);
    }
  }

  /**
   * Create a new rota with name and optional description.
   * @param {string} name - The name of the rota to create.
   * @param {string} description - The description of the rota to create (optional).
   * @returns {Promise<RotaDescription>} A Promise that resolves to a RotaDescription for the created rota.
   * @throws {Error} If the request fails or the response is not valid JSON.
   */
  async createRota(name: string, description?: string): Promise<RotaDescription> {
    try {
      const response = await axios.post<RotaDescription>(
        `${this.baseURL}/api/rotas`,
        JSON.stringify({ name, description })
      );
      return response.data;
    } catch (error) {
      throw new Error(`Could not create rota \`${name}\`. Error: ${(error as Error).message}.`);
    }
  }

  /**
   * Delete a rota.
   * @param {string} name - The name of the rota to delete.
   * @returns {Promise<undefined>} A Promise that resolves to undefined if the deletion was successful.
   * @throws {Error} If the API request fails.
   */
  async deleteRota(name: string): Promise<undefined> {
    try {
      await axios.delete<undefined>(
        `${this.baseURL}/api/rotas/${name}`
      );
      return undefined;
    } catch (error) {
      throw new Error(`Could not delete \`${name}\`. Error: ${(error as Error).message}.`);
    }
  }

  /**
   * Add users to a rota.
   * @param {string} name - The name of the rota to add users to.
   * @param {Array<string>} users - An array of the users to add to the rota.
   * @returns {Promise<undefined>} A Promise that resolves to undefined if the request was successful.
   * @throws {Error} If the API request fails.
   */
  async addUsersToRota(name: string, users: Array<string>): Promise<undefined> {
    if (users.length === 0) {
      throw new Error("Error: Users must be non-empty.");
    }
    try {
      const response = await axios.post<undefined>(
        `${this.baseURL}/api/rotas/${name}/users`,
        JSON.stringify({ users })
      );
      return response.data;
    } catch (error) {
      throw new Error(`Could not add users to \`${name}\` rota. Error: ${(error as Error).message}.`);
    }
  }

  /**
   * Retrieve a user by name.
   * @param {string} name - The name of the user.
   * @returns {Promise<User>} A Promise that resolves to a User object.
   * @throws {Error} If the API request fails or the response is invalid.
   */
  async getUserByName(name: string): Promise<User> {
    try {
      const response = await axios.get<User>(
        `${this.baseURL}/api/users/by-name/${encodeURIComponent(name)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Could not get user \`${name}\`. Error: ${(error as Error).message}.`);
    }
  }

  /**
   * Update a rota's assigned user.
   * @param {string} rota - The rota to be updated.
   * @param {number} assigned - The ID of the user to assign to the rota.
   * @returns {Promise<undefined>} A Promise that resolves to undefined if the update was successful.
   * @throws {Error} If the API request fails.
   */
  async updateRota(rota: string, assigned: number): Promise<undefined> {
    try {
      await axios.patch(
        `${this.baseURL}/api/rotas/${rota}`,
        JSON.stringify({ assigned })
      );
      return undefined;
    } catch (error) {
      throw new Error(`Could not update \`${rota}\` rota. Error: ${(error as Error).message}.`);
    }
  }

  /**
   * Rotate a rota, updating the assigned user to the next user in the list.
   * @param {string} rota - The name of the rota to rotate.
   * @returns {Promise<Rota>} The updated rota.
   * @throws {Error} If the request fails or the response is not valid JSON.
   */
  async rotateRota(rota: string): Promise<Rota> {
    try {
      const response = await axios.get<Rota>(
        `${this.baseURL}/api/rotas/${rota}/rotate`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Could not rotate \`${rota}\` rota. Error: ${(error as Error).message}.`);
    }
  }
}

export { IAPIService, APIService };
