import parse from '../src/mentions/parse';
import { RotaDescription } from '../src/models/rota';
import { expect, jest } from '@jest/globals';
import APIService, { mockGetRotas, mockCreateRota, mockDeleteRota, mockAddUsersToRota, mockGetRota, mockRotateRota, mockUpdateRota, mockGetUserByName } from '../src/services/__mocks__/api_service';

jest.mock("../src/services/api_service");

describe('app_mentions parsing', () => {

  const mockAPIService = new APIService({ baseURL: 'https://www.example.com' });
  const mockSay = jest.fn();

  beforeEach(() => {
    mockGetRota.mockClear();
    mockGetRotas.mockClear();
    mockCreateRota.mockClear();
    mockDeleteRota.mockClear();
    mockAddUsersToRota.mockClear();
    mockGetUserByName.mockClear();
    mockUpdateRota.mockClear();
    mockRotateRota.mockClear();
    mockSay.mockClear();
  });

  it('should list rotas', async () => {
    // GIVEN the API service returns a list of rotas
    mockGetRotas.mockResolvedValue([
      { name: 'standup', description: 'daily check-in' },
      { name: 'retrospective', description: 'reflect on the past month' },
    ] as Array<RotaDescription>);
    // WHEN we parse the input 'list'
    const input = 'list';
    await parse(input, mockAPIService, mockSay);
    // THEN the API service should be called
    expect(mockGetRotas).toHaveBeenCalledTimes(1);
    // AND the response should be sent to the user
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
    // GIVEN
    mockCreateRota.mockResolvedValue(
      { name: 'standup', description: 'daily standup' },
    );
    // WHEN
    const input = 'create standup "daily standup"';
    await parse(input, mockAPIService, mockSay);
    // THEN
    expect(mockCreateRota).toHaveBeenCalledWith('standup', 'daily standup');
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
    // GIVEN
    mockCreateRota.mockResolvedValue(
      { name: 'standup', description: null },
    );
    // WHEN
    const input = 'create standup';
    await parse(input, mockAPIService, mockSay);
    // THEN
    expect(mockCreateRota).toHaveBeenCalledWith('standup', undefined);
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
    // GIVEN
    mockDeleteRota.mockResolvedValue(undefined);
    // WHEN
    const input = 'delete standup';
    await parse(input, mockAPIService, mockSay);
    // THEN
    expect(mockDeleteRota).toHaveBeenCalledWith('standup');
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

  it("should add users to a rota", async () => {
    // GIVEN
    mockAddUsersToRota.mockResolvedValue(undefined);
    // WHEN
    const input = 'add standup @Sara @Yusuf';
    await parse(input, mockAPIService, mockSay);
    // THEN
    expect(mockAddUsersToRota).toHaveBeenCalledWith('standup', ['@Sara', '@Yusuf']);
    expect(mockSay).toHaveBeenCalledTimes(1);
  });

  it('should assign a user to a rota', async () => {
    // GIVEN
    mockUpdateRota.mockResolvedValue(undefined);
    // WHEN
    const input = 'assign @Russell standup';
    await parse(input, mockAPIService, mockSay);
    // THEN
    expect(mockSay).toHaveBeenCalledTimes(1);
  });

  it('should return who is assigned to a rota', async () => {
    // GIVEN
    mockGetRota.mockResolvedValue({
      rota: { name: 'standup', description: 'daily check-in' },
      assigned: "@Yusuf",
      users: ["@Yusuf", "@Octavia", "@Fatima"]
    });
    // WHEN
    const input = 'who standup';
    await parse(input, mockAPIService, mockSay);
    // THEN
    expect(mockGetRota).toHaveBeenCalledTimes(1);
    expect(mockGetRota).toHaveBeenCalledWith("standup")
    expect(mockSay).toHaveBeenCalledTimes(1);
    expect(mockSay).toHaveBeenCalledWith("@Yusuf");
  });

  it('should rotate a rota', async () => {
    // GIVEN
    mockRotateRota.mockResolvedValue({
      rota: { name: 'standup', description: 'daily check-in' },
      assigned: '@Octavia',
      users: ["@Yusuf", "@Octavia", "@Fatima"]
    });
    // WHEN
    const input = 'rotate standup';
    await parse(input, mockAPIService, mockSay);
    // THEN
    expect(mockRotateRota).toHaveBeenCalledTimes(1);
    expect(mockRotateRota).toHaveBeenCalledWith("standup")
    expect(mockSay).toHaveBeenCalledTimes(1);
    expect(mockSay).toHaveBeenCalledWith("`standup` was rotated. `@Octavia` is now the assigned user.");
  });

  describe('show', () => {
    it("should show a rota", async () => {
      const input = 'show standup';
      await parse(input, mockAPIService, mockSay);
      expect(mockGetRota).toHaveBeenCalledWith('standup');
      expect(mockSay).toHaveBeenCalledTimes(1);
    });

    // it("should complain if no name was given", async () => {
    //   const input = 'show';
    //   await parse(input, mockAPIService, mockSay);
    //   expect(mockGetRota).toHaveBeenCalledTimes(0);
    //   expect(mockSay).toHaveBeenCalledWith("🤔 I'm sorry, I didn't understand that. Please try rephrasing your question or enter `@Rota help` to see a list of available commands.");
    // });
  });

  describe('unknown', () => {
    it('should handle an unknown command', async () => {
      const input = 'unknown command';
      await parse(input, mockAPIService, mockSay);
      expect(mockSay).toHaveBeenCalledTimes(1);
      expect(mockSay).toHaveBeenCalledWith("🤔 I'm sorry, I didn't understand that. Please try rephrasing your question or enter `@Rota help` to see a list of available commands.");
    });
  });

});
