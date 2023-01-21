import { IStorage } from 'types/interfaces';

export const storage: IStorage = {
  cars: [],
  carsCount: 0,
  pageNumber: 1,
  carToUpdateId: 0,
  carToDriveStatus: {},
  inputName: '',
  inputColor: '',
  inputColorDefault: '#000000',
  isFinished: false,
  isWinner: false,
  winner: {
    id: 0,
    name: '',
    color: '',
    wins: 0,
    time: 0,
  },
};

export default storage;
