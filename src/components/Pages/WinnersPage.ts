import { ICar, IWinner, IWinners } from 'types/interfaces';
import createElement from 'components/helpers/createElement';
import CarWinner from 'components/CarWinner/CarWinner';
import storage from 'components/helpers/storage';
import Pagination from 'components/Pagination/Pagination';
import { WINNERS_PER_PAGE } from 'constants/Constants';
import RequestsApi from 'components/Api/RequestsApi';

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
    this.init();
  }

  public async init() {
    this.winners.append(this.winnersList);
    await this.getWinners(storage.winnersPageNumber);
    this.createWinnersList(storage.winners);
    this.pagination.render(storage.winnersPageNumber, storage.winnersCount);
    this.createTitle();
  }

  private createTitle(): HTMLElement {
    this.title.innerHTML = `Winners = ${storage.winnersCount} =`; //! repiat
    return this.title;
  }

  private async getWinners(page: number) {
    this.carListNumber = (page - 1) * WINNERS_PER_PAGE + 1;
    this.winnersList.innerHTML = '';
    this.winnersList.append(CarWinner.renderHeader());

    const dataWinners: IWinners = await RequestsApi.getWinners(page);
    storage.winnersCount = Number(dataWinners.count);
    storage.winners = dataWinners.winners;
  }

  private createWinnersList(dataWinners: IWinner[]) {
    dataWinners.forEach(async (winner) => {
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
    });
  }

  public addPaginationListener() {
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
