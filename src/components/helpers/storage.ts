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
  isRace: false,
  winner: {
    id: 0,
    name: '',
    color: '',
    wins: 0,
    time: 0,
  },
  winnersCount: 0,
  winnersPageNumber: 1,
  allCars: [],
  winners: [],
  sortOption: 'id',
  sortOrder: 'ASC',
};

export default storage;
