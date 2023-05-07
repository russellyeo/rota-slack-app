const { APIService } = require('../services/api_service');
const { Rota, RotaDescription } = require('../models/rota');

describe('APIService', () => {
  let apiService;

  beforeEach(() => {
    apiService = new APIService({ baseURL: 'https://example.com' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getRotas', () => {
    it('should return an array of rotas', async () => {
      // GIVEN the fetch function returns a successful response with a list of rotas
      global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { name: 'standup', description: 'daily check-in' },
          { name: 'retrospective', description: 'reflect on the past month' },
        ]),
      }));
      // WHEN we get the list of rotas
      const result = await apiService.getRotas();
      // THEN the list is returned
      expect(result).toEqual([
        { name: 'standup', description: 'daily check-in' },
        { name: 'retrospective', description: 'reflect on the past month' },
      ]);
    });

    it('should throw an error if the request fails', async () => {
      // GIVEN the fetch function returns a failure
      global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
      // WHEN we attempt to get the list of rotas
      const result = apiService.getRotas();
      // THEN an error is thrown
      await expect(result).rejects.toThrowError('Could not retrieve rotas');
    });
  });

  describe('getRota', () => {
    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          rota: { name: 'standup', description: 'daily check-in' },
          assigned: '@Yusuf',
          users: ['@Yusuf', '@Helena']
        })
      });
    });

    it('should return a Rota object with the correct properties', async () => {
      const rota = await apiService.getRota('standup');
      expect(rota.rota).toBeInstanceOf(RotaDescription);
      expect(rota.rota.name).toBe('standup');
      expect(rota.rota.description).toBe('daily check-in');
      expect(rota.assigned).toBe('@Yusuf');
      expect(rota.users).toEqual(['@Yusuf', '@Helena']);
    });

    it('should throw an error if the request fails', async () => {
      global.fetch.mockResolvedValueOnce({ ok: false });
      await expect(apiService.getRota('standup')).rejects.toThrow('Could not retrieve rota');
    });

    it('should throw an error if the response is not valid JSON', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.reject() });
      await expect(apiService.getRota('standup')).rejects.toThrow('Could not parse response');
    });
  });

  describe('createRota', () => {
    it('should create a new rota with a name and a description', async () => {
      // GIVEN createRota will succeed and return the created rota
      global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ name: 'coffee', description: 'whose turn is it to make coffee?' }),
      }));
      // WHEN we create a new rota
      const result = await apiService.createRota('coffee', 'whose turn is it to make coffee?');
      // THEN the rota is successfully created
      expect(result).toEqual({ name: 'coffee', description: 'whose turn is it to make coffee?' });
    });

    it('should create a new rota with just a name', async () => {
      // GIVEN createRota will succeed and return the created rota
      global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ name: 'coffee' }),
      }));
      // WHEN we create a new rota
      const result = await apiService.createRota('coffee', undefined);
      // THEN the rota is successfully created
      expect(result).toEqual({ name: 'coffee' });
    });

    it('should throw an error if the request fails', async () => {
      // GIVEN createRota will fail
      global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
      // WHEN we attempt to create a new rota
      const result = apiService.createRota('coffee', 'whose turn is it to make coffee?');
      // THEN an error is thrown
      await expect(result).rejects.toThrowError('Could not create rota');
    });
  });

  describe('deleteRota', () => {
    it('should delete an existing rota', async () => {
      // GIVEN deleteRota will succeed
      global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
      // WHEN we delete the rota
      const result = await apiService.deleteRota('retrospective');
      // THEN the rota is deleted
      expect(result).toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith(
        "https://example.com/api/rotas/retrospective",
        { "headers": { "Content-Type": "application/json" }, "method": "DELETE" }
      );
    });

    it('should throw an error if the request fails', async () => {
      // GIVEN deleteRota will fail
      global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
      // WHEN we attempt to delete the rota
      const result = apiService.deleteRota('retrospective');
      // THEN an error is thrown
      await expect(result).rejects.toThrowError('Could not delete rota `retrospective`');
    });
  });

  describe('addUsersToRota', () => {
    it('should update an existing rota', async () => {
      // GIVEN addUsersToRota will succeed
      global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
      // WHEN we assign users to an existing rota
      const result = await apiService.addUsersToRota('standup', ['@Yasmin', '@Florian'])
      // THEN the rota is updated
      expect(result).toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith(
        "https://example.com/api/rotas/standup/users",
        {
          "headers": { "Content-Type": "application/json" },
          "method": "POST",
          "body": JSON.stringify({ "users": ["@Yasmin", "@Florian"] })
        }
      );
    });

    it('should throw an error if the request fails', async () => {
      // GIVEN addUsersToRota will fail
      global.fetch = jest.fn(() => Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "rota with id standup not found" })
      }));
      // WHEN we attempt to update the rota
      // THEN an error is thrown
      await expect(apiService.addUsersToRota('standup', ['@Yasmin', '@Florian']))
        .rejects
        .toThrowError("Could not assign users to rota `standup`. rota with id standup not found");
    });

    it('should throw an error if the users array is empty', async () => {
      await expect(apiService.addUsersToRota('standup', []))
        .rejects
        .toThrowError("Users must be non-empty");
    });

  });
});
