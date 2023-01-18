import { ICar } from 'types/interfaces';
import Car from 'components/Car/Car';
import createElement from 'components/helpers/createElement';
import CarTrack from 'components/CarTrack/CarTrack';
import RequestsApi from 'components/Api/RequestsApi';
import { storage } from 'components/helpers/storage';
import { disableForms } from 'components/helpers/disableForms';

class MainPage {
  container: HTMLElement;

  main: HTMLElement;

  constructor(
    container: HTMLElement,
    private requestApi = new RequestsApi(),
    private title = createElement('h1', 'garage__title'),
    private garage = createElement('div', 'garage'),
    private garageList = createElement('div', 'garage__list') as HTMLDivElement,
    private settings = createElement('div', 'settings'),
    private settingsCreateForm = createElement('form', 'settings__field') as HTMLFormElement,
    private settingsUpdateForm = createElement('form', 'settings__field') as HTMLFormElement,

    private inputNameUpdate = createElement('input', 'settings__data') as HTMLInputElement,
    private inputColorUpdate = createElement('input', 'settings__color') as HTMLInputElement,
    private buttonUpdate = createElement('button', ['button', 'button_settings']) as HTMLButtonElement,
  ) {
    this.container = container;
    this.main = createElement('main', 'main');
    this.container.append(this.main);
    this.main.append(garage);
    this.title.innerHTML = `Garage = ${storage.carsCount} =`;
    garage.append(this.title);
    garage.append(this.settings);
    garage.append(this.createPagination());

    settings.append(this.createSettingsCreate());
    settings.append(this.createSettingsUpdate());
    settings.append(this.createSettingsButtons());
    this.init();
    this.addGarageListListener();
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
    const inputNameCreate = createElement('input', 'settings__data') as HTMLInputElement;
    inputNameCreate.type = 'name';
    inputNameCreate.placeholder = 'car name';
    inputNameCreate.value = storage.inputName;
    inputNameCreate.required = true;
    inputNameCreate.addEventListener('change', () => {
      storage.inputName = inputNameCreate.value;
    });

    const inputColorCreate = createElement('input', 'settings__color') as HTMLInputElement;
    inputColorCreate.type = 'color';
    inputColorCreate.value = storage.inputColor;
    inputColorCreate.addEventListener('change', () => {
      storage.inputColor = inputColorCreate.value;
    });

    const buttonCreate = createElement('button', ['button', 'button_settings']) as HTMLButtonElement;
    buttonCreate.innerText = 'Create';

    buttonCreate.addEventListener('click', async () => {
      if (this.settingsCreateForm.checkValidity() === true) {
        await this.createCar({
          name: inputNameCreate.value,
          color: inputColorCreate.value,
        });
      }
    });

    this.settingsCreateForm.append(inputNameCreate);
    this.settingsCreateForm.append(inputColorCreate);
    this.settingsCreateForm.append(buttonCreate);

    return this.settingsCreateForm;
  }

  private createSettingsUpdate(): HTMLElement {
    this.inputNameUpdate.type = 'name';
    this.inputNameUpdate.required = true;
    this.inputColorUpdate.type = 'color';
    this.buttonUpdate.innerText = 'Update';

    this.buttonUpdate.addEventListener('click', async () => {
      if (this.settingsUpdateForm.checkValidity() === true) {
        await this.updateCar({
          name: this.inputNameUpdate.value,
          color: this.inputColorUpdate.value,
          id: storage.carToUpdateId,
        });
      }
    });

    this.settingsUpdateForm.append(this.inputNameUpdate);
    this.settingsUpdateForm.append(this.inputColorUpdate);
    this.settingsUpdateForm.append(this.buttonUpdate);

    disableForms(this.settingsUpdateForm, true);
    return this.settingsUpdateForm;
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

  private createGarageList(cars: ICar[]): HTMLElement {
    this.garageList.innerHTML = '';

    const garageCars: HTMLElement[] = cars.map((car) => new CarTrack(car)).map((car) => car.render());

    garageCars.forEach((car) => {
      this.garageList.append(car);
    });

    return this.garageList;
  }

  private addGarageListListener() {
    this.garageList.addEventListener('click', (event) => {
      const target = event.target;

      if (target instanceof HTMLElement && target.id.includes('remove')) {
        const [, removeId] = target.id.split('-');
        this.garageRemoveCar(Number(removeId));
      }

      if (target instanceof HTMLElement && target.id.includes('select')) {
        const [, selectId] = target.id.split('-');
        this.garageSelectCar(Number(selectId));
      }
    });
  }

  private createCar(car: ICar): void {
    this.requestApi.createCar(car);
    this.init();
  }

  private async updateCar(car: ICar): Promise<void> {
    await this.requestApi.updateCar(car);
    disableForms(this.settingsUpdateForm, true);
    disableForms(this.settingsCreateForm, false);
    this.inputNameUpdate.value = '';
    this.inputColorUpdate.value = storage.inputColorDefault;
    this.init();
  }

  private generateRandomCars(): void {
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

  private async garageSelectCar(id: number) {
    disableForms(this.settingsCreateForm, true);

    const car: ICar = await this.requestApi.getCar(id);
    await this.requestApi.updateCar(car);
    storage.carToUpdateId = Number(car.id);

    disableForms(this.settingsUpdateForm, false);
    this.inputNameUpdate.value = car.name;
    this.inputColorUpdate.value = car.color;
  }

  public removePage() {
    this.container.innerHTML = '';
  }
}

export default MainPage;
