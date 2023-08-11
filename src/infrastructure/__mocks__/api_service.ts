
import { IAPIService } from '../api_service';

export const mockGetRota = jest.fn();
export const mockGetRotas = jest.fn();
export const mockCreateRota = jest.fn()
export const mockDeleteRota = jest.fn()
export const mockAddUsersToRota = jest.fn()
export const mockGetUserByName = jest.fn()
export const mockUpdateRota = jest.fn()
export const mockRotateRota = jest.fn()

const APIServiceMock: IAPIService = {
  getRota: mockGetRota,
  getRotas: mockGetRotas,
  createRota: mockCreateRota,
  deleteRota: mockDeleteRota,
  addUsersToRota: mockAddUsersToRota,
  getUserByName: mockGetUserByName,
  updateRota: mockUpdateRota,
  rotateRota: mockRotateRota
};

export default APIServiceMock as jest.Mocked<typeof APIServiceMock>;