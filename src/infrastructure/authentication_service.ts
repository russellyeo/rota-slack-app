import { Installation } from '@slack/bolt';
import axios from "axios";

import { AxiosInstance, AxiosError } from "axios";

interface IAuthenticationService {
  /**
   * Stores the installation information in the database on the server.
   *
   * @param {Installation} installation - The Slack installation information.
   * @returns {Promise<undefined>} Resolves to undefined when successful. Rejects when request fails.
   */
  createEnterpriseInstallation(installation: Installation): Promise<void>;

  /**
   * Stores the installation information in the database on the server.
   *
   * @param {Installation} installation - The Slack installation information.
   * @returns {Promise<undefined>} Resolves to undefined when successful. Rejects when request fails.
   */
  createTeamInstallation(installation: Installation): Promise<undefined>;

  /**
   * Fetches the installation information from the database on the server.
   *
   * @param {string} id - The enterprise id.
   * @returns {Promise<Installation>} The enterprise installation information associated with the id.
   */
  fetchEnterpriseInstallation(id: string): Promise<Installation>;

  /**
   * Fetches the installation information from the database on the server.
   *
   * @param {string} id - The team id.
   * @returns {Promise<Installation>} The team installation information associated with the id.
   * @throws {Error} If the API request fails.
   */
  fetchTeamInstallation(id: string): Promise<Installation>;

  /**
   * Deletes the enterprise installation information from the database on the server.
   *
   * @param {string} id - The id of the enterprise installation.
   * @returns {Promise<undefined>} Resolves to undefined when successful. Rejects when deletion fails.
   */
  deleteEnterpriseInstallation(id: string): Promise<undefined>;

  /**
   * Deletes the team installation information from the database on the server.
   *
   * @param {string} id - The id of the team installation.
   * @returns {Promise<undefined>} Resolves to undefined when successful. Rejects when deletion fails.
   */
  deleteTeamInstallation(id: string): Promise<undefined>;
}

class AuthenticationService implements IAuthenticationService {
  private apiClient: AxiosInstance;
  
  constructor({ apiClient }: { apiClient: AxiosInstance }) {
    this.apiClient = apiClient;
  }

  async createEnterpriseInstallation(installation: Installation): Promise<void> {
    try {
      await this.apiClient.post<void>(
        '/api/v1/slack-installation',
        JSON.stringify({ installation })
      );
    } catch (error) {
      if ((error as AxiosError).response) {
        throw new Error(`Request failed with status code ${(error as AxiosError).response?.status}`);
      } else {
        throw new Error('Unexpected error');
      }
    }
  }

  async createTeamInstallation(installation: Installation): Promise<undefined> {
    return this.apiClient
      .post<undefined>(
        '/api/v1/slack-installation',
        JSON.stringify({ installation })
      )
      .then((response) => undefined);
  }

  async fetchEnterpriseInstallation(id: string): Promise<Installation> {
    return this.apiClient
      .get<Installation>(
        `/api/v1/slack-installation/${id}`
      )
      .then((response) => response.data);
  }

  async fetchTeamInstallation(id: string): Promise<Installation> {
    return this.apiClient
      .get<Installation>(
        `/api/v1/slack-installation/${id}`
      )
      .then((response) => response.data);
  }

  async deleteEnterpriseInstallation(id: string): Promise<undefined> {
    return this.apiClient
      .delete<undefined>(
        `/api/v1/slack-installation/${id}`
      )
      .then((response) => undefined);
  }

  async deleteTeamInstallation(id: string): Promise<undefined> {
    return this.apiClient
      .delete<undefined>(
        `/api/v1/slack-installation/${id}`
      )
      .then((response) => undefined);
  }

}

export { IAuthenticationService, AuthenticationService };