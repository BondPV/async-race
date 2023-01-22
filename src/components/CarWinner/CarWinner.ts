import { IWinner } from 'types/interfaces';
import createElement from 'components/helpers/createElement';
import { CarImage } from 'components/Car/CarImage';

class CarWinner {
  winner: Required<IWinner>;

  constructor(winner: Required<IWinner>) {
    this.winner = winner;
  }

  static renderHeader(): HTMLElement {
    const header = createElement('div', ['winners__row', 'winners__row_header']);
    const cellNumber = createElement('div', ['winners__cell', 'winners__cell_header']);
    const cellCarImage = createElement('div', ['winners__cell', 'winners__cell_header']);
    const cellName = createElement('div', ['winners__cell', 'winners__cell_header']);
    const cellWins = createElement('div', ['winners__cell', 'winners__cell_header']);
    const cellTime = createElement('div', ['winners__cell', 'winners__cell_header']);

    cellNumber.innerText = 'Number';
    cellCarImage.innerText = 'Car';
    cellName.innerText = 'Name';
    cellWins.innerText = 'Wins';
    cellTime.innerText = 'Best time';

    header.append(cellNumber);
    header.append(cellCarImage);
    header.append(cellName);
    header.append(cellWins);
    header.append(cellTime);

    return header;
  }

  public renderRow(number: number): HTMLElement {
    const row = createElement('div', 'winners__row');
    const cellNumber = createElement('div', 'winners__cell');
    const cellCarImage = createElement('div', 'winners__cell');
    const cellName = createElement('div', 'winners__cell');
    const cellWins = createElement('div', 'winners__cell');
    const cellTime = createElement('div', 'winners__cell');

    cellNumber.innerText = `${number}`;
    cellCarImage.innerHTML = `${CarImage(this.winner.color)}`;
    cellName.innerText = `${this.winner.name}`;
    cellWins.innerText = `${this.winner.wins}`;
    cellTime.innerText = `${this.winner.time}`;

    row.append(cellNumber);
    row.append(cellCarImage);
    row.append(cellName);
    row.append(cellWins);
    row.append(cellTime);

    return row;
  }
}

export default CarWinner;
