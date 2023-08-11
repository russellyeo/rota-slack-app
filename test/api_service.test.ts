import { APIService } from '../src/services/api_service';
import { Rota } from '../src/models/rota';

import axios from 'axios';
jest.mock("axios");

describe('APIService', () => {
  let apiService: APIService;

  beforeEach(() => {
    apiService = new APIService({ baseURL: 'https://example.com' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRotas', () => {
    it('should return an array of rotas', async () => {
      // GIVEN the axios.get function returns a successful response with a list of rotas
      const expectedRotas = [
        { name: 'standup', description: 'daily check-in' },
        { name: 'retrospective', description: 'reflect on the past month' },
      ];
      jest.mocked(axios.get).mockResolvedValue({ status: 200, data: expectedRotas });
      // WHEN we call getRotas
      const result = await apiService.getRotas();
      // THEN the expectedRotas array is returned
      expect(result).toEqual(expectedRotas);
      // AND axios.get is called with the correct URL
      expect(axios.get).toHaveBeenCalledWith('https://example.com/api/rotas');
    });

    it('should throw an error if the request fails', async () => {
      // GIVEN the axios.get function returns a failure response
      jest.mocked(axios.get).mockRejectedValue({ status: 500, message: 'Internal error' });
      // WHEN we call getRotas
      const result = apiService.getRotas();
      // THEN an error is thrown
      await expect(result).rejects.toThrowError('Could not get rotas. Error: Internal error.');
    });
  });

  describe('getRota', () => {
    it('should return a Rota object with the correct properties', async () => {
      // GIVEN the axios.get function returns a successful response
      jest.mocked(axios.get).mockResolvedValue({
        status: 200,
        data: {
          rota: { name: 'standup', description: 'daily check-in' },
          assigned: '@Yusuf',
          users: ['@Yusuf', '@Helena']
        }
      });
      // WHEN we ask for the standup rota
      const rota = await apiService.getRota('standup');
      // THEN we get the standup rota
      expect(rota.rota.name).toBe('standup');
      expect(rota.rota.description).toBe('daily check-in');
      expect(rota.assigned).toBe('@Yusuf');
      expect(rota.users).toEqual(['@Yusuf', '@Helena']);
    });

    it('should throw an error if the request fails', async () => {
      // GIVEN the axios.get function returns a 404 not found response
      jest.mocked(axios.get).mockRejectedValue({ status: 404, message: "Rota not found" });
      // WHEN we ask for a rota
      const result = apiService.getRota('standup');
      // THEN an error is thrown
      await expect(result).rejects.toThrowError('Could not get `standup` rota. Error: Rota not found');
    });
  });

  describe('createRota', () => {
    it('should create a new rota with a name and a description', async () => {
      // GIVEN the axios.post function returns a successful response
      jest.mocked(axios.post).mockResolvedValue({
        status: 201,
        data: {
          name: 'coffee',
          description: 'whose turn is it to make coffee?'
        }
      });
      // WHEN we create a new rota
      const result = await apiService.createRota('coffee', 'whose turn is it to make coffee?');
      // THEN the rota is successfully created
      expect(result).toEqual({ name: 'coffee', description: 'whose turn is it to make coffee?' });
    });

    it('should create a new rota with just a name', async () => {
      // GIVEN the axios.post function returns a successful response
      jest.mocked(axios.post).mockResolvedValue({
        status: 201,
        data: {
          name: 'coffee'
        }
      });
      // WHEN we create a new rota
      const result = await apiService.createRota('coffee', undefined);
      // THEN the rota is successfully created
      expect(result).toEqual({ name: 'coffee' });
    });

    it('should throw an error if the request fails', async () => {
      // GIVEN the axios.post function returns a failure response
      jest.mocked(axios.post).mockRejectedValue({ status: 400, message: 'The name is not valid' });
      // WHEN we attempt to create a new rota
      const result = apiService.createRota('coffee run', 'whose turn is it to get coffee?');
      // THEN an error is thrown
      await expect(result).rejects.toThrowError('Could not create rota `coffee run`. Error: The name is not valid.');
    });
  });

  describe('deleteRota', () => {
    it('should delete an existing rota', async () => {
      // GIVEN axios.delete will succeed
      jest.mocked(axios.delete).mockResolvedValue({ status: 200 });
      // WHEN we delete the rota
      const result = await apiService.deleteRota('retrospective');
      // THEN the rota is deleted
      expect(axios.delete).toHaveBeenCalledWith("https://example.com/api/rotas/retrospective");
      expect(result).toBeUndefined();
    });

    it('should throw an error if the request fails', async () => {
      // GIVEN axios.delete will fail
      jest.mocked(axios.delete).mockRejectedValue({ status: 404, message: "Rota not found" });
      // WHEN we attempt to delete the rota
      const result = apiService.deleteRota('retrospective');
      // THEN an error is thrown
      await expect(result).rejects.toThrowError('Could not delete `retrospective`. Error: Rota not found.');
    });
  });

  describe('addUsersToRota', () => {
    it('should update an existing rota', async () => {
      // GIVEN axios.get will succeed
      jest.mocked(axios.post).mockResolvedValue({ status: 200 });
      // WHEN we assign users to an existing rota
      const result = await apiService.addUsersToRota('standup', ['@Yasmin', '@Florian'])
      // THEN the rota is updated
      expect(result).toBeUndefined();
      expect(axios.post).toHaveBeenCalledWith(
        "https://example.com/api/rotas/standup/users",
        JSON.stringify({ "users": ["@Yasmin", "@Florian"] })
      );
    });

    it('should throw an error if the request fails', async () => {
      // GIVEN axios.post will fail
      jest.mocked(axios.post).mockRejectedValue({ status: 404, message: "Rota not found" });
      // WHEN we attempt to update the rota
      const result = apiService.addUsersToRota('standup', ['@Yasmin', '@Florian']);
      // THEN an error is thrown
      await expect(result).rejects.toThrowError("Could not add users to `standup` rota. Error: Rota not found.");
    });

    it('should throw an error if the users array is empty', async () => {
      const result = apiService.addUsersToRota('standup', [])
      await expect(result).rejects.toThrowError("Error: Users must be non-empty.");
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe('getUserByName', () => {
    it('should get a user by name', async () => {
      // GIVEN axios.get will return a successful response
      jest.mocked(axios.get).mockResolvedValue({ status: 200, data: { id: 1, name: "@Russell" } });
      // WHEN we get a user by name
      const result = await apiService.getUserByName('@Russell');
      // THEN the user is returned
      expect(axios.get).toHaveBeenCalledWith("https://example.com/api/users/by-name/%40Russell");
      expect(result).toEqual({ id: 1, name: "@Russell" });
    });

    it('should return not found if the user does not exist', async () => {
      // GIVEN axios.get will return a 404 not found response
      jest.mocked(axios.get).mockRejectedValue({ status: 404, message: "User not found" });
      // WHEN we get a user by name
      const result = apiService.getUserByName('@Russell');
      // THEN an error is thrown
      await expect(result).rejects.toThrowError('Could not get user `@Russell`. Error: User not found.');
      expect(axios.get).toHaveBeenCalledWith("https://example.com/api/users/by-name/%40Russell");
    });
  });

  describe('updateRota', () => {
    it('should update a rota', async () => {
      // GIVEN axios.patch will return a successful response
      jest.mocked(axios.patch).mockResolvedValue({ status: 200, data: { assigned: 1 } });
      // WHEN we update a rota
      const result = await apiService.updateRota('standup', 1);
      // THEN the rota is updated
      expect(axios.patch).toHaveBeenCalledWith(
        "https://example.com/api/rotas/standup",
        JSON.stringify({ "assigned": 1 })
      );
      expect(result).toBeUndefined();
    });

    it('should return an error if the request fails', async () => {
      // GIVEN axios.patch will fail
      jest.mocked(axios.patch).mockRejectedValue({ status: 404, message: "Rota not found" });
      // WHEN we update a rota
      const result = apiService.updateRota('standup', 1);
      // THEN an error is thrown
      await expect(result).rejects.toThrowError('Could not update `standup` rota. Error: Rota not found.');
    });
  });

  describe('rotateRota', () => {
    it('should rotate a rota', async () => {
      // GIVEN axios.get will return a successful response
      jest.mocked(axios.get).mockResolvedValue({
        status: 200,
        data: {
          rota: { name: "standup", description: "daily check-in" },
          assigned: "@Helena",
          users: ["@Yusuf", "@Helena"]
        }
      });
      // WHEN we rotate a rota
      const result = await apiService.rotateRota('standup');
      // THEN
      const expectedRota: Rota = {
        rota: { name: "standup", description: "daily check-in" },
        assigned: "@Helena",
        users: ["@Yusuf", "@Helena"]
      };
      expect(axios.get).toHaveBeenCalledWith("https://example.com/api/rotas/standup/rotate");
      expect(result).toStrictEqual(expectedRota);
    });

    it('should return an error if the request fails', async () => {
      // GIVEN axios.get will fail
      jest.mocked(axios.get).mockRejectedValue({ status: 404, message: "Rota not found" });
      // WHEN we rotate a rota
      const result = apiService.rotateRota('standup');
      // THEN an error is thrown
      await expect(result).rejects.toThrowError('Could not rotate `standup` rota. Error: Rota not found.');
    });
  });

});
