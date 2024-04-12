import { AuthenticationService } from '../../src/infrastructure/authentication_service';
import { Installation } from '@slack/bolt';

import axios, { AxiosError, AxiosHeaders } from 'axios';

jest.mock('axios');
const apiClient = axios as jest.Mocked<typeof axios>;

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    authenticationService = new AuthenticationService({ apiClient: apiClient });
    jest.clearAllMocks();
  });

  describe('createEnterpriseInstallation', () => {
    it('should send a request to create an enterprise installation', async () => {
      // GIVEN the slack endpoint returns 201 created
      apiClient.post.mockResolvedValue({ status: 201 });
      // WHEN we create an enterprise installation
      const installation: Installation = {
        team: undefined,
        enterprise: { id: 'E12345', name: 'Acme Corp' },
        user: { token: 'xoxp-1234', scopes: ['chat:write'], id: 'U12345' },
        bot: { token: 'xoxb-1234', scopes: ['chat:write'], id: 'B12345', userId: 'U12345' },
        incomingWebhook: undefined,
        appId: "A12345",
        tokenType: "bot",
        isEnterpriseInstall: true,
        authVersion: "v2",
        metadata: undefined
      };
      const result = authenticationService.createEnterpriseInstallation(installation);
      // THEN the result resolves successfully
      expect(result).resolves.toBeUndefined();
      // AND axios.post was called with the correct URL
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/v1/slack-installation',
        JSON.stringify({ installation })
      );
    });

    it('should throw an error if the request fails', async () => {
      // GIVEN slack returns an error
      const headers = new AxiosHeaders();
      const error: AxiosError = {
        name: 'Error',
        message: 'Request failed with status code 500',
        isAxiosError: true,
        toJSON: () => ({ message: 'Request failed with status code 500' }),
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          headers: headers,
          config: { url: "https://example.com", headers },
          data: {}
        }
      };
      apiClient.post.mockRejectedValue(error);

      // WHEN we create an enterprise installation
      const installation: Installation = {
        team: undefined,
        enterprise: { id: 'E12345', name: 'Acme Corp' },
        user: { token: 'xoxp-1234', scopes: ['chat:write'], id: 'U12345' },
        bot: { token: 'xoxb-1234', scopes: ['chat:write'], id: 'B12345', userId: 'U12345' },
        incomingWebhook: undefined,
        appId: "A12345",
        tokenType: "bot",
        isEnterpriseInstall: true,
        authVersion: "v2",
        metadata: undefined
      };
      const result = authenticationService.createEnterpriseInstallation(installation);
      
      // THEN an error is thrown
      expect(result).rejects.toThrow('Request failed with status code 500');
    });
  });
});
