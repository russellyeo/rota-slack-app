const parse = require('../mentions/parse');
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
    deleteRota: jest.fn().mockResolvedValue(undefined),
    addUsersToRota: jest.fn().mockResolvedValue(undefined),
  })),
}));

describe('app_mentions parsing', () => {
  let mockAPIService;
  let mockSay;

  beforeEach(() => {
    mockAPIService = new APIService({ baseURL: 'https://example.com' });
    mockSay = jest.fn();
  });

  it('should list rotas', async () => {
    const input = 'list';
    await parse(input, mockAPIService, mockSay);
    expect(mockAPIService.getRotas).toHaveBeenCalledTimes(1);
    expect(mockSay).toHaveBeenCalledWith({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Rotas in your workspace*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "`standup` - daily check-in\n`retrospective` - reflect on the past month",
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Try `@Rota help` for to see a list of possible commands',
          },
        }
      ]
    });
  });

  it('should list available commands when asked for help', async () => {
    const input = 'help';
    await parse(input, mockAPIService, mockSay);
    expect(mockSay).toHaveBeenCalledTimes(1);
  });

  it('should create a new rota with a name and description', async () => {
    const input = 'create standup "daily standup"';
    await parse(input, mockAPIService, mockSay);
    expect(mockAPIService.createRota).toHaveBeenCalledWith('standup', 'daily standup');
    expect(mockSay).toHaveBeenCalledWith({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "Successfully created `standup` rota",
          }
        }
      ]
    });
  });

  it('should create a new rota with just a name', async () => {
    const input = 'create standup';
    await parse(input, mockAPIService, mockSay);
    expect(mockAPIService.createRota).toHaveBeenCalledWith('standup', undefined);
    expect(mockSay).toHaveBeenCalledWith({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "Successfully created `standup` rota",
          }
        }
      ]
    });
  });

  it('should delete a a rota', async () => {
    const input = 'delete standup';
    await parse(input, mockAPIService, mockSay);
    expect(mockAPIService.deleteRota).toHaveBeenCalledWith('standup');
    expect(mockSay).toHaveBeenCalledWith({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "Successfully deleted `standup` rota",
          }
        }
      ]
    });
  });

  it('should handle an unknown command', async () => {
    const input = 'unknown command';
    await parse(input, mockAPIService, mockSay);
    expect(mockSay).toHaveBeenCalledTimes(1);
    expect(mockSay).toHaveBeenCalledWith('unknown command');
  });

  it("should add users to a rota", async () => {
    const input = 'add standup @Sara @Yusef';
    await parse(input, mockAPIService, mockSay);
    expect(mockAPIService.addUsersToRota).toHaveBeenCalledWith('standup', ['@Sara', '@Yusef']);
    expect(mockSay).toHaveBeenCalledTimes(1);
  });

});
