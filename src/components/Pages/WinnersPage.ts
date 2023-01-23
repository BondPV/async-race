import { ICar, IWinner, IWinners } from 'types/interfaces';
import createElement from 'components/helpers/createElement';
import CarWinner from 'components/CarWinner/CarWinner';
import storage from 'components/helpers/storage';
import Pagination from 'components/Pagination/Pagination';
import { WINNERS_PER_PAGE } from 'constants/Constants';
import RequestsApi from 'components/Api/RequestsApi';
import { SortOptionsType, SortOrderType } from 'types/types';

class WinnersPage {
  container: HTMLElement;

  quantityPage: number;

  carListNumber: number;

  main: HTMLElement;

  winnersToPage: CarWinner[];

  pagination: Pagination;

  constructor(
    container: HTMLElement,
    private title = createElement('h1', 'winners__title'),
    private winners = createElement('div', 'winners'),
    private winnersList = createElement('div', 'winners__list') as HTMLDivElement,
    private sortOption: SortOptionsType = 'id',
    private sortOrder: SortOrderType = 'ASC',
    private isWinsUp = true,
    private isTimeUp = true,
  ) {
    this.container = container;
    this.quantityPage = 1;
    this.carListNumber = 1;
    this.main = createElement('main', 'main');
    this.container.append(this.main);
    this.main.append(winners);
    this.title.innerHTML = `Winners = ${storage.winnersCount} =`;
    winners.append(this.title);
    this.pagination = new Pagination(this, WINNERS_PER_PAGE);
    this.addPaginationListener();
    winners.append(this.pagination.render(storage.winnersPageNumber, storage.winnersCount));
    this.winnersList.append();
    this.winnersToPage = [];
    this.addSortListener();
    this.init();
  }

  public async init() {
    this.winners.append(this.winnersList);
    await this.getWinners(storage.winnersPageNumber, this.sortOption, this.sortOrder);
    this.createWinnersList(storage.winners);
    this.pagination.render(storage.winnersPageNumber, storage.winnersCount);
    this.createTitle();
  }

  private createTitle(): HTMLElement {
    this.title.innerHTML = `Winners = ${storage.winnersCount} =`;
    return this.title;
  }

  private async getWinners(page: number, sort: SortOptionsType, order: SortOrderType) {
    this.carListNumber = (page - 1) * WINNERS_PER_PAGE + 1;
    this.winnersList.innerHTML = '';
    this.winnersList.append(CarWinner.renderHeader());

    const dataWinners: IWinners = await RequestsApi.getWinners(page, sort, order);
    storage.winnersCount = Number(dataWinners.count);
    storage.winners = dataWinners.winners;
  }

  private async createWinnersList(dataWinners: IWinner[]) {
    for (const winner of dataWinners) {
      const dataCar: ICar = await RequestsApi.getCar(winner.id);
      const winnerCar: Required<IWinner> = {
        id: winner.id,
        name: dataCar.name,
        color: dataCar.color,
        wins: winner.wins,
        time: winner.time,
      };
      this.winnersList.append(new CarWinner(winnerCar).renderRow(this.carListNumber));
      this.carListNumber += 1;
    }
  }

  private addSortListener() {
    CarWinner.cellWins.addEventListener('click', () => {
      this.sortOption = 'wins';

      if (this.isWinsUp) {
        this.isWinsUp = false;
        this.sortOrder = 'ASC';
        CarWinner.cellWins.classList.add('up');
        CarWinner.cellWins.classList.remove('down');
      } else {
        this.isWinsUp = true;
        this.sortOrder = 'DESC';
        CarWinner.cellWins.classList.add('down');
        CarWinner.cellWins.classList.remove('up');
      }

      CarWinner.cellTime.classList.remove('down');
      CarWinner.cellTime.classList.remove('up');
      console.log(this.sortOption, this.sortOrder);
      this.init();
    });

    CarWinner.cellTime.addEventListener('click', () => {
      this.sortOption = 'time';

      if (this.isTimeUp) {
        this.isTimeUp = false;
        this.sortOrder = 'ASC';
        CarWinner.cellTime.classList.add('up');
        CarWinner.cellTime.classList.remove('down');
      } else {
        this.isTimeUp = true;
        this.sortOrder = 'DESC';
        CarWinner.cellTime.classList.add('down');
        CarWinner.cellTime.classList.remove('up');
      }

      CarWinner.cellWins.classList.remove('down');
      CarWinner.cellWins.classList.remove('up');
      console.log(this.sortOption, this.sortOrder);
      this.init();
    });
  }

  private addPaginationListener() {
    this.pagination.buttonPrev.addEventListener('click', () => {
      if (storage.winnersPageNumber > 1) {
        storage.winnersPageNumber -= 1;
        this.init();
      }
    });

    this.pagination.buttonNext.addEventListener('click', () => {
      if (storage.winnersPageNumber < this.quantityPage) {
        storage.winnersPageNumber += 1;
        this.init();
      }
    });
  }

  public removePage() {
    this.container.innerHTML = '';
  }
}

export default WinnersPage;
