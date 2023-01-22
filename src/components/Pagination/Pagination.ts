import createElement from 'components/helpers/createElement';
import MainPage from 'components/Pages/MainPage';
import WinnersPage from 'components/Pages/WinnersPage';

class Pagination {
  quantityPerPage: number;

  pagination: HTMLElement;

  buttonPrev: HTMLButtonElement;

  paginationPageNum: HTMLElement;

  buttonNext: HTMLButtonElement;

  page: MainPage | WinnersPage;

  constructor(page: MainPage | WinnersPage, quantityPerPage: number) {
    this.page = page;
    this.quantityPerPage = quantityPerPage;
    this.pagination = createElement('div', 'pagination');
    this.buttonPrev = createElement('button') as HTMLButtonElement;
    this.paginationPageNum = createElement('div', 'pagination__page');
    this.buttonNext = createElement('button') as HTMLButtonElement;
  }

  public render(pageNumber: number, carsCount: number): HTMLElement {
    this.page.quantityPage = Math.ceil(carsCount / this.quantityPerPage);

    if (pageNumber >= this.page.quantityPage) {
      pageNumber = this.page.quantityPage;
    }

    this.buttonPrev.innerText = 'Prev';

    this.paginationPageNum.innerHTML = `${pageNumber} | ${this.page.quantityPage}`;

    this.buttonNext.innerText = 'Next';

    this.pagination.append(this.buttonPrev);
    this.pagination.append(this.paginationPageNum);
    this.pagination.append(this.buttonNext);

    return this.pagination;
  }
}

export default Pagination;
