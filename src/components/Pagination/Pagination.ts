import createElement from 'components/helpers/createElement';

class Pagination {
  quantityPerPage: number;

  pagination: HTMLElement;

  buttonPrev: HTMLButtonElement;

  paginationPageNum: HTMLElement;

  buttonNext: HTMLButtonElement;

  quantityPage: number;

  constructor(quantityPerPage: number) {
    this.quantityPage = 1;
    this.quantityPerPage = quantityPerPage;
    this.pagination = createElement('div', 'pagination');
    this.buttonPrev = createElement('button') as HTMLButtonElement;
    this.paginationPageNum = createElement('div', 'pagination__page');
    this.buttonNext = createElement('button') as HTMLButtonElement;
  }

  public render(pageNumber: number, carsCount: number): HTMLElement {
    this.quantityPage = Math.ceil(carsCount / this.quantityPerPage);

    if (pageNumber >= this.quantityPage) {
      pageNumber = this.quantityPage;
    }

    this.buttonPrev.innerText = 'Prev';
    this.buttonPrev.disabled = true;

    this.paginationPageNum.innerHTML = `${pageNumber} | ${this.quantityPage}`;

    this.buttonNext.innerText = 'Next';
    this.buttonPrev.disabled = true;

    this.disabledButton(pageNumber, this.quantityPage);

    this.pagination.append(this.buttonPrev);
    this.pagination.append(this.paginationPageNum);
    this.pagination.append(this.buttonNext);

    return this.pagination;
  }

  public disabledButton(pageNumber: number, quantityPage: number) {
    if (pageNumber === 1 && quantityPage === 1) {
      this.buttonPrev.disabled = true;
      this.buttonNext.disabled = true;
    }

    if (pageNumber === quantityPage && quantityPage > 1) {
      this.buttonPrev.disabled = false;
      this.buttonNext.disabled = true;
    }

    if (pageNumber > 1 && pageNumber < quantityPage) {
      this.buttonPrev.disabled = false;
      this.buttonNext.disabled = false;
    }
  }
}

export default Pagination;
