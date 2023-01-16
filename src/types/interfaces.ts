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
  cars: ICar[];
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
  id?: number;
  wins: number;
  time: number;
}

export interface IWinners {
  winners: IWinner[];
  count: string | null;
}
