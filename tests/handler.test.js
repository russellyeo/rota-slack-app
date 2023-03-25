const handler = require('../mentions/handler');
const { APIService } = require('../networking/api_service');

jest.mock('../networking/api_service', () => {
  return {
    APIService: jest.fn().mockImplementation(() => {
      return {
        getRotas: jest.fn().mockResolvedValue([
          { name: 'Rota 1', description: 'Description 1' },
          { name: 'Rota 2', description: 'Description 2' }
        ]),
        createRota: jest.fn().mockResolvedValue(
          { name: 'Rota 3', description: 'Description 3' }
        )
      };
    })
  };
});

test('handler should handle a command to create a new rota', async () => {
  const mockAPIService = new APIService({ baseURL: 'https://example.com' });
  const mockSay = jest.fn();
  const input = 'create "Search UX Team Standup" "Daily Standup"';
  
  await handler.handle(input, mockAPIService, mockSay);
  
  expect(mockAPIService.createRota).toHaveBeenCalledWith('"Search UX Team Standup"', '"Daily Standup"');
});