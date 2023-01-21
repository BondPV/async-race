import { ICar, IEngine } from 'types/interfaces';
import Car from 'components/Car/Car';
import createElement from 'components/helpers/createElement';
import CarTrack from 'components/CarTrack/CarTrack';
import RequestsApi from 'components/Api/RequestsApi';
import Pagination from 'components/Pagination/Pagination';
import { storage } from 'components/helpers/storage';
import { disableForms } from 'components/helpers/disableForms';
import { CARS_PER_PAGE } from 'constants/Constants';
import { ModeEngine } from 'types/enums';

class MainPage {
  container: HTMLElement;

  main: HTMLElement;

  pagination: Pagination;

  buttonRace: HTMLButtonElement;

  buttonReset: HTMLButtonElement;

  buttonRandom: HTMLButtonElement;

  carTracksToPage: CarTrack[];

  constructor(
    container: HTMLElement,
    private title = createElement('h1', 'garage__title'),
    private garage = createElement('div', 'garage'),
    private garageList = createElement('div', 'garage__list') as HTMLDivElement,
    private settings = createElement('div', 'settings'),
    private settingsCreateForm = createElement('form', 'settings__field') as HTMLFormElement,
    private settingsUpdateForm = createElement('form', 'settings__field') as HTMLFormElement,

    private inputNameCreate = createElement('input', 'settings__data') as HTMLInputElement,
    private inputColorCreate = createElement('input', 'settings__color') as HTMLInputElement,
    private inputNameUpdate = createElement('input', 'settings__data') as HTMLInputElement,
    private inputColorUpdate = createElement('input', 'settings__color') as HTMLInputElement,
    private buttonCreate = createElement('button', ['button', 'button_settings']) as HTMLButtonElement,
    private buttonUpdate = createElement('button', ['button', 'button_settings']) as HTMLButtonElement,
  ) {
    this.container = container;
    this.main = createElement('main', 'main');
    this.container.append(this.main);
    this.main.append(garage);
    this.title.innerHTML = `Garage = ${storage.carsCount} =`;
    garage.append(this.title);
    garage.append(this.settings);
    this.pagination = new Pagination(CARS_PER_PAGE);
    garage.append(this.pagination.render(storage.pageNumber, storage.carsCount));

    this.buttonRace = createElement('button', ['button', 'button_settings']) as HTMLButtonElement;
    this.buttonReset = createElement('button', ['button', 'button_settings']) as HTMLButtonElement;
    this.buttonRandom = createElement('button', ['button', 'button_settings']) as HTMLButtonElement;

    settings.append(this.createSettingsCreate());
    settings.append(this.createSettingsUpdate());
    settings.append(this.createSettingsButtons());

    this.init();

    this.addGarageListListener();
    this.addPaginationListener();
    this.addButtonCreateListener();
    this.addButtonUpdateListener();
    this.addButtomRandomListener();
    this.addButtonRaceListener();
    this.addButtonResetListener();

    this.carTracksToPage = [];
  }

  private async init() {
    await this.garageGetCars(storage.pageNumber);
    await this.createGarageList(storage.cars);
    await this.garage.append(this.garageList);
    this.pagination.render(storage.pageNumber, storage.carsCount);
    this.createTitle();
  }

  private createTitle(): HTMLElement {
    this.title.innerHTML = `Garage = ${storage.carsCount} =`;
    return this.title;
  }

  private createSettingsCreate(): HTMLElement {
    this.inputNameCreate.type = 'name';
    this.inputNameCreate.placeholder = 'car name';
    this.inputNameCreate.value = storage.inputName;
    this.inputNameCreate.required = true;
    this.inputNameCreate.addEventListener('change', () => {
      storage.inputName = this.inputNameCreate.value;
    });

    this.inputColorCreate.type = 'color';
    this.inputColorCreate.value = storage.inputColor;
    this.inputColorCreate.addEventListener('change', () => {
      storage.inputColor = this.inputColorCreate.value;
    });

    this.buttonCreate.innerText = 'Create';

    this.settingsCreateForm.append(this.inputNameCreate);
    this.settingsCreateForm.append(this.inputColorCreate);
    this.settingsCreateForm.append(this.buttonCreate);

    return this.settingsCreateForm;
  }

  private createSettingsUpdate(): HTMLElement {
    this.inputNameUpdate.type = 'name';
    this.inputNameUpdate.required = true;
    this.inputColorUpdate.type = 'color';
    this.buttonUpdate.innerText = 'Update';

    this.settingsUpdateForm.append(this.inputNameUpdate);
    this.settingsUpdateForm.append(this.inputColorUpdate);
    this.settingsUpdateForm.append(this.buttonUpdate);

    disableForms(this.settingsUpdateForm, true);
    return this.settingsUpdateForm;
  }

  private createSettingsButtons(): HTMLElement {
    const settingsButtons = createElement('div', 'settings__buttons');

    this.buttonRace.innerText = 'Race';

    this.buttonReset.innerText = 'Reset';
    this.buttonReset.disabled = true;

    this.buttonRandom.innerText = 'Generate cars';

    settingsButtons.append(this.buttonRace);
    settingsButtons.append(this.buttonReset);
    settingsButtons.append(this.buttonRandom);

    return settingsButtons;
  }

  private async garageGetCars(page: number) {
    const data = await RequestsApi.getsCars(page);
    storage.cars = data.cars;
    storage.carsCount = Number(data.count);
  }

  private createGarageList(cars: Required<ICar>[]): HTMLElement {
    this.garageList.innerHTML = '';

    cars.forEach((car, i) => {
      this.carTracksToPage[i] = new CarTrack(car);
      this.garageList.append(this.carTracksToPage[i].render());
    });

    return this.garageList;
  }

  private addGarageListListener() {
    this.garageList.addEventListener('click', (event) => {
      event.preventDefault();
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
    RequestsApi.createCar(car);
    this.init();
  }

  private async updateCar(car: ICar): Promise<void> {
    await RequestsApi.updateCar(car);
    disableForms(this.settingsUpdateForm, true);
    disableForms(this.settingsCreateForm, false);
    this.inputNameUpdate.value = '';
    this.inputColorUpdate.value = storage.inputColorDefault;
    this.init();
  }

  private generateRandomCars(): void {
    const randomCars = Car.generateRandomCars();

    randomCars.forEach((car) => {
      RequestsApi.createCar(car);
    });

    this.init();
  }

  private async garageRemoveCar(id: number): Promise<void> {
    await RequestsApi.deleteCar(id);
    delete storage.carToDriveStatus[`driveId${id}`];
    this.init();
  }

  private async garageSelectCar(id: number) {
    disableForms(this.settingsCreateForm, true);

    const car: Required<ICar> = await RequestsApi.getCar(id);
    await RequestsApi.updateCar(car);
    storage.carToUpdateId = car.id;

    disableForms(this.settingsUpdateForm, false);
    this.inputNameUpdate.value = car.name;
    this.inputColorUpdate.value = car.color;
  }

  private addPaginationListener() {
    this.pagination.buttonPrev.addEventListener('click', () => {
      storage.pageNumber -= 1;
      this.init();
    });

    this.pagination.buttonNext.addEventListener('click', () => {
      storage.pageNumber += 1;
      this.init();
    });
  }

  private addButtonCreateListener() {
    this.buttonCreate.addEventListener('click', async (event) => {
      event.preventDefault();

      if (this.settingsCreateForm.checkValidity() === true) {
        await this.createCar({
          name: this.inputNameCreate.value,
          color: this.inputColorCreate.value,
        });
      }
    });
  }

  private addButtonUpdateListener() {
    this.buttonUpdate.addEventListener('click', async (event) => {
      event.preventDefault();

      if (this.settingsUpdateForm.checkValidity() === true) {
        await this.updateCar({
          name: this.inputNameUpdate.value,
          color: this.inputColorUpdate.value,
          id: storage.carToUpdateId,
        });
      }
    });
  }

  private addButtomRandomListener() {
    this.buttonRandom.addEventListener('click', () => {
      this.generateRandomCars();
    });
  }

  private addButtonRaceListener() {
    this.buttonRace.addEventListener('click', async () => {
      const requests: Promise<{ status: number; result: IEngine }>[] = [];

      this.buttonReset.disabled = false;
      this.buttonRace.disabled = true;
      this.buttonCreate.disabled = true;
      this.buttonRandom.disabled = true;

      this.carTracksToPage.forEach((carTrack) => {
        carTrack.startDriveButtonDisabled();
        requests.push(RequestsApi.controlEngine(carTrack.car.id, ModeEngine.start));
      });
      const data = await Promise.all(requests);

      this.carTracksToPage.forEach(async (carTrack, i) => {
        const { result } = data[i];
        const time = result.distance / result.velocity;
        carTrack.startDrive(carTrack.car.id, time);
        await carTrack.switchEngineToDriveMode(carTrack.car.id);
      });
    });
  }

  private addButtonResetListener() {
    this.buttonReset.addEventListener('click', () => {
      storage.isWinner = false;
      storage.isFinished = false;

      this.carTracksToPage.forEach((carTrack) => {
        carTrack.stopCarEngine(carTrack.car.id);
      });
      this.buttonRace.disabled = false;
      this.buttonReset.disabled = true;
      this.buttonCreate.disabled = false;
      this.buttonRandom.disabled = false;
    });
  }

  public removePage() {
    this.container.innerHTML = '';
  }
}

export default MainPage;
