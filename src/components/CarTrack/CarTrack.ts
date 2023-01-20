import { ICar } from 'types/interfaces';
import { ModeEngine } from 'types/enums';
import createElement from 'components/helpers/createElement';
import { CarImage } from 'components/Car/CarImage';
import { flagImage } from './flagImage';
import storage from 'components/helpers/storage';
import RequestsApi from 'components/Api/RequestsApi';

class CarTrack {
  car: ICar;

  track: HTMLElement;

  carImage: HTMLElement;

  carAnimation: Animation | undefined;

  buttonSelect: HTMLButtonElement;

  buttonRemove: HTMLButtonElement;

  buttonStart: HTMLButtonElement;

  buttonStop: HTMLButtonElement;

  constructor(car: ICar) {
    this.car = car;
    this.track = createElement('div', 'garage__track');
    this.carImage = createElement('div', 'garage__car-image');
    this.buttonSelect = createElement('button', ['button', 'button_car'], `select-${this.car.id}`) as HTMLButtonElement;
    this.buttonRemove = createElement('button', ['button', 'button_car'], `remove-${this.car.id}`) as HTMLButtonElement;
    this.buttonStart = createElement('button', 'button', `start-${this.car.id}`) as HTMLButtonElement;
    this.buttonStop = createElement('button', 'button', `stop-${this.car.id}`) as HTMLButtonElement;
  }

  public render(): HTMLElement {
    const carTrack = createElement('div', 'garage__car');
    const carName = createElement('span', 'garage__name');
    carName.innerText = this.car.name;

    this.carImage.innerHTML = `${CarImage(this.car.color)}`;

    const flagImg = createElement('div', 'garage__flag-image');
    flagImg.innerHTML = `${flagImage}`;

    this.track.append(this.carImage);
    this.track.append(flagImg);

    carTrack.append(this.createButtonsSelection());
    carTrack.append(carName);
    carTrack.append(this.createButtonsControls());
    carTrack.append(this.track);

    return carTrack;
  }

  private createButtonsSelection(): HTMLElement {
    const buttonsSelection = createElement('div', 'garage__buttons-selection');

    this.buttonSelect.innerText = 'Select';
    this.buttonRemove.innerText = 'Remove';

    buttonsSelection.append(this.buttonSelect);
    buttonsSelection.append(this.buttonRemove);

    return buttonsSelection;
  }

  private createButtonsControls(): HTMLElement {
    const buttonsControls = createElement('div', 'garage__buttons-controls');

    this.buttonStart.innerText = 'Start';
    buttonsControls.append(this.buttonStart);

    this.buttonStart.onclick = () => {
      if (this.car.id) this.startCarEngine(this.car.id);
    };

    this.buttonStop.innerText = 'Stop';
    this.buttonStop.disabled = true;
    this.buttonStop.onclick = () => {
      if (this.car.id) this.stopCarEngine(this.car.id);
    };

    buttonsControls.append(this.buttonStop);

    return buttonsControls;
  }

  public async startCarEngine(id: number): Promise<void> {
    const data = await RequestsApi.controlEngine(id, ModeEngine.start);
    if (data.status === 200) {
      storage.carToDriveStatus[`driveId${id}`] = true;
      this.buttonStart.disabled = true;
      this.buttonStop.disabled = false;
      this.buttonSelect.disabled = true;
      this.buttonRemove.disabled = true;
      const { result } = data;
      const time = result.distance / result.velocity;
      this.animateCar(time);
      await this.switchEngineToDriveMode(id);
    }
  }

  public async stopCarEngine(id: number): Promise<void> {
    const data = await RequestsApi.controlEngine(id, ModeEngine.stop);
    if (data.status === 200) {
      this.buttonStart.disabled = false;
      this.buttonStop.disabled = true;
      this.buttonSelect.disabled = false;
      this.buttonRemove.disabled = false;
      storage.carToDriveStatus[`driveId${id}`] = false;
      this.carAnimation?.cancel();
      this.resetCarPosition(this.carImage, id);
    }
  }

  private async switchEngineToDriveMode(id: number): Promise<void> {
    const data = await RequestsApi.switchEngineToDriveMode(id);
    if (!data.success && storage.carToDriveStatus[`driveId${id}`] === true) {
      storage.carToDriveStatus[`driveId${id}`] = false;
      this.carAnimation?.cancel();
      //TODO implement the correct stop of the machine
      this.carImage.style.left = '50%';
    }
  }

  private animateCar(time: number): void {
    const carSize = this.carImage.clientWidth;
    this.carAnimation = this.carImage.animate([{ left: '0px' }, { left: `calc(100% - ${carSize}px)` }], {
      duration: time,
    });
    this.carAnimation.play();
    this.carImage.style.left = `calc(100% - ${carSize}px)`;
  }

  private resetCarPosition(elem: HTMLElement, id: number) {
    storage.carToDriveStatus[`driveId${id}`] = false;
    elem.hidden = true;
    elem.style.left = '0px';
    setTimeout(() => {
      elem.hidden = false;
    }, 100);
  }
}

export default CarTrack;
