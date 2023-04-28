const handler = require('../mentions/handler');
const { APIService } = require('../networking/api_service');

// Mock APIService return values
jest.mock('../networking/api_service', () => ({
  APIService: jest.fn().mockImplementation(() => ({
    getRotas: jest.fn().mockResolvedValue([
      { name: 'standup', description: 'daily check-in' },
      { name: 'retrospective', description: 'reflect on the past month' },
    ]),
    createRota: jest.fn().mockResolvedValue(
      { name: 'coffee', description: 'whose turn is it to make coffee?' },
    ),
    deleteRota: jest.fn().mockResolvedValue({}),
  })),
}));

describe('app_mentions handler', () => {
  let mockAPIService;
  let mockSay;

  beforeEach(() => {
    mockAPIService = new APIService({ baseURL: 'https://example.com' });
    mockSay = jest.fn();
  });

  it('should list rotas', async () => {
    const input = 'list';
    await handler.handle(input, mockAPIService, mockSay);
    expect(mockAPIService.getRotas).toHaveBeenCalledTimes(1);
  });

  it('should create a new rota', async () => {
    const input = 'create "standup" "daily standup"';
    await handler.handle(input, mockAPIService, mockSay);
    expect(mockAPIService.createRota).toHaveBeenCalledWith('standup', 'daily standup');
  });

  it('should deleta a rota', async () => {
    const input = 'delete "standup"';
    await handler.handle(input, mockAPIService, mockSay);
    expect(mockAPIService.deleteRota).toHaveBeenCalledWith('standup');
  });

  it('should handle an unknown command', async () => {
    const input = 'unknown command';
    await handler.handle(input, mockAPIService, mockSay);
    expect(mockSay).toHaveBeenCalledTimes(1);
    expect(mockSay).toHaveBeenCalledWith('unknown command');
  });
});
