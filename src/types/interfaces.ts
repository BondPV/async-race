import { CarToDriveStatusType } from 'types/types';

export interface IQueryParams {
  key: string;
  value: number | string;
}

export interface ICar {
  id?: number;
  name: string;
  color: string;
}

export interface ICars {
  cars: Required<ICar>[];
  count: string | null;
}

export interface IEngine {
  velocity: number;
  distance: number;
}

export interface IDriveStatus {
  success: boolean;
}

export interface IWinner {
  id: number;
  wins: number;
  time: number;
  name?: string;
  color?: string;
}

export interface IWinners {
  winners: IWinner[];
  count: string | null;
}

export interface IStorage {
  cars: Required<ICar>[];
  carsCount: number;
  pageNumber: number;
  carToUpdateId: number;
  carToDriveStatus: CarToDriveStatusType;
  inputName: string;
  inputColor: string;
  inputColorDefault: string;
  isWinner: boolean;
  isFinished: boolean;
  winner: IWinner;
  winnersCount: number;
  winnersPageNumber: number;
  winners: IWinner[];
}
