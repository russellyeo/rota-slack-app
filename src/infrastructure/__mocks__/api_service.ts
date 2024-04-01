import { IAPIService } from '../api_service';
import { Rota, RotaDescription } from '../../entities/rota';
import { User } from '../../entities/user';

export const mockGetRota: jest.Mock<Promise<Rota>, [string]> = jest.fn();
export const mockGetRotas: jest.Mock<Promise<Array<RotaDescription>>, []> = jest.fn();
export const mockCreateRota: jest.Mock<Promise<RotaDescription>, [string, string?]> = jest.fn();
export const mockDeleteRota: jest.Mock<Promise<undefined>, [string]> = jest.fn();
export const mockAddUsersToRota: jest.Mock<Promise<undefined>, [string, Array<string>]> = jest.fn();
export const mockGetUserByName: jest.Mock<Promise<User>, [string]> = jest.fn();
export const mockUpdateRota: jest.Mock<Promise<undefined>, [string, number]> = jest.fn();
export const mockRotateRota: jest.Mock<Promise<Rota>, [string]> = jest.fn();
export const mockRemoveUserFromRota: jest.Mock<Promise<undefined>, [string, string]> = jest.fn();

const MockAPIService: IAPIService = {
  getRota: mockGetRota,
  getRotas: mockGetRotas,
  createRota: mockCreateRota,
  deleteRota: mockDeleteRota,
  addUsersToRota: mockAddUsersToRota,
  getUserByName: mockGetUserByName,
  updateRota: mockUpdateRota,
  rotateRota: mockRotateRota,
  removeUserFromRota: mockRemoveUserFromRota
};

export default MockAPIService as jest.Mocked<typeof MockAPIService>;