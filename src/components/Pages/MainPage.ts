import Header from './header/header';
import Footer from './footer/footer';
import { ICar } from 'types/interfaces';
import Car from 'components/Car/Car';
import createElement from 'components/helpers/createElement';
import CarTrack from 'components/CarTrack/CarTrack';
import RequestsApi from 'components/Api/RequestsApi';
import { storage } from 'components/helpers/storage';

class MainPage {
  container: HTMLElement;

  main: HTMLElement;

  title: HTMLElement;

  settings: HTMLElement;

  garage: HTMLElement;

  garageList: HTMLDivElement;

  constructor(container: HTMLElement, private requestApi = new RequestsApi()) {
    this.container = container;
    new Header(this.container);
    this.main = createElement('main', 'main');
    this.container.append(this.main);
    new Footer(this.container);

    this.garage = createElement('div', 'garage');
    this.garageList = createElement('div', 'garage__list') as HTMLDivElement;
    this.settings = createElement('div', 'settings');

    this.main.append(this.garage);
    this.title = createElement('h1', 'garage__title');
    this.garage.append(this.title);
    this.garage.append(this.settings);
    this.garage.append(this.createPagination());

    this.settings.append(this.createSettingsCreate());
    this.settings.append(this.createSettingsUpdate());
    this.settings.append(this.createSettingsButtons());
    this.init();
  }

  private async init() {
    await this.garageGetCars(storage.pageNumber);
    await this.createGarageList(storage.cars);
    await this.garage.append(this.garageList);
    this.createTitle();
  }

  private createTitle(): HTMLElement {
    this.title.innerHTML = `Garage = ${storage.carsCount} =`;
    return this.title;
  }

  private createSettingsCreate(): HTMLElement {
    const settingsCreate = createElement('div', 'settings__field');
    const inputNameCreate = createElement('input', 'settings__data') as HTMLInputElement;
    inputNameCreate.type = 'name';
    inputNameCreate.placeholder = 'car name';

    const inputColorCreate = createElement('input', 'settings__color') as HTMLInputElement;
    inputColorCreate.type = 'color';

    const buttonCreate = createElement('button', ['button', 'button_settings']) as HTMLButtonElement;
    buttonCreate.innerText = 'Create';

    settingsCreate.append(inputNameCreate);
    settingsCreate.append(inputColorCreate);
    settingsCreate.append(buttonCreate);

    return settingsCreate;
  }

  private createSettingsUpdate(): HTMLElement {
    const settingsUpdate = createElement('div', 'settings__field');
    const inputNameUpdate = createElement('input', 'settings__data') as HTMLInputElement;
    inputNameUpdate.type = 'name';
    inputNameUpdate.disabled = true;

    const inputColorUpdate = createElement('input', 'settings__color') as HTMLInputElement;
    inputColorUpdate.type = 'color';
    inputColorUpdate.disabled = true;

    const buttonUpdate = createElement('button', ['button', 'button_settings']) as HTMLButtonElement;
    buttonUpdate.innerText = 'Update';
    buttonUpdate.disabled = true;

    settingsUpdate.append(inputNameUpdate);
    settingsUpdate.append(inputColorUpdate);
    settingsUpdate.append(buttonUpdate);

    return settingsUpdate;
  }

  private createSettingsButtons(): HTMLElement {
    const settingsButtons = createElement('div', 'settings__buttons');

    const buttonRace = createElement('button', ['button', 'button_settings']) as HTMLButtonElement;
    buttonRace.innerText = 'Race';

    const buttonReset = createElement('button', ['button', 'button_settings']) as HTMLButtonElement;
    buttonReset.innerText = 'Update';
    buttonReset.disabled = true;

    const buttonRandom = createElement('button', ['button', 'button_settings']) as HTMLButtonElement;
    buttonRandom.innerText = 'Generate cars';

    settingsButtons.append(buttonRace);
    settingsButtons.append(buttonReset);
    settingsButtons.append(buttonRandom);

    buttonRandom.addEventListener('click', () => {
      this.generateRandomCars();
    });

    return settingsButtons;
  }

  private createPagination(): HTMLElement {
    const pagination = createElement('div', 'pagination');

    const buttonPrev = createElement('button') as HTMLButtonElement;
    buttonPrev.innerText = 'Prev';
    buttonPrev.disabled = true;

    const paginationPageNum = createElement('div', 'pagination__page');
    paginationPageNum.innerHTML = `${storage.pageNumber}`;

    const buttonNext = createElement('button') as HTMLButtonElement;
    buttonNext.innerText = 'Next';
    buttonNext.disabled = true;

    pagination.append(buttonPrev);
    pagination.append(paginationPageNum);
    pagination.append(buttonNext);

    return pagination;
  }

  private async garageGetCars(page: number) {
    const data = await this.requestApi.getsCars(page);
    storage.cars = data.cars;
    storage.carsCount = Number(data.count);
  }

  private async garageGetCounts(page: number) {
    const data = await this.requestApi.getsCars(page);
    storage.cars = data.cars;
  }

  private createGarageList(cars: ICar[]): HTMLElement {
    this.garageList.innerHTML = '';

    const garageCars: HTMLElement[] = cars.map((car) => new CarTrack(car)).map((car) => car.render());

    garageCars.forEach((car) => {
      this.garageList.append(car);
      car.addEventListener('click', (event) => {
        const target = event.target;

        if (target instanceof HTMLElement && target.id.includes('remove')) {
          const [, removeId] = target.id.split('-');
          this.garageRemoveCar(Number(removeId));
        }
      });
    });

    return this.garageList;
  }

  private async generateRandomCars(): Promise<void> {
    const randomCars = Car.generateRandomCars();

    randomCars.forEach((car) => {
      this.requestApi.createCar(car);
    });

    this.init();
  }

  private async garageRemoveCar(id: number): Promise<void> {
    await this.requestApi.deleteCar(id);
    this.init();
  }

  public removePage() {
    this.container.innerHTML = '';
  }
}

export default MainPage;
