import { ISlackAdapter } from '../slack_adapter';

export const mockSay = jest.fn() as jest.MockedFunction<ISlackAdapter['say']>;
export const mockSetSayFn = jest.fn() as jest.MockedFunction<ISlackAdapter['setSayFn']>;

const MockSlackAdapter: ISlackAdapter = {
  say: mockSay,
  setSayFn: mockSetSayFn,
};

export default MockSlackAdapter as jest.Mocked<typeof MockSlackAdapter>;