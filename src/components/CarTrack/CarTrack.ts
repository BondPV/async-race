import { ICar, IWinner } from 'types/interfaces';
import { ModeEngine } from 'types/enums';
import createElement from 'components/helpers/createElement';
import { CarImage } from 'components/Car/CarImage';
import { flagImage } from './flagImage';
import storage from 'components/helpers/storage';
import RequestsApi from 'components/Api/RequestsApi';
import { winnerNotificationModal, showWinnerNotification } from 'components/helpers/showWinnerNotification';

class CarTrack {
  public car: Required<ICar>;

  private track: HTMLElement;

  private carImage: HTMLElement;

  private carAnimation: Animation | undefined;

  private buttonSelect: HTMLButtonElement;

  private buttonRemove: HTMLButtonElement;

  private buttonStart: HTMLButtonElement;

  private buttonStop: HTMLButtonElement;

  private startCarPosition: string;

  constructor(car: Required<ICar>) {
    this.car = car;
    this.track = createElement('div', 'garage__track');
    this.carImage = createElement('div', 'garage__car-image');
    this.buttonSelect = createElement('button', ['button', 'button_car'], `select-${this.car.id}`) as HTMLButtonElement;
    this.buttonRemove = createElement('button', ['button', 'button_car'], `remove-${this.car.id}`) as HTMLButtonElement;
    this.buttonStart = createElement('button', 'button', `start-${this.car.id}`) as HTMLButtonElement;
    this.buttonStop = createElement('button', 'button', `stop-${this.car.id}`) as HTMLButtonElement;
    this.startCarPosition = '0px';
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
      const { result } = data;
      const time = result.distance / result.velocity;
      this.startDrive(id, time);
      await this.switchEngineToDriveMode(id);
    }
  }

  public startDrive(id: number, time: number) {
    storage.carToDriveStatus[`driveId${id}`] = true;
    this.startDriveButtonDisabled();
    this.animateCar(id, time);
  }

  public startDriveButtonDisabled() {
    this.buttonStart.disabled = true;
    this.buttonStop.disabled = false;
    this.buttonSelect.disabled = true;
    this.buttonRemove.disabled = true;
  }

  public async stopCarEngine(id: number): Promise<void> {
    const data = await RequestsApi.controlEngine(id, ModeEngine.stop);
    if (data.status === 200) {
      this.stopDriveButtonDisable();
      storage.carToDriveStatus[`driveId${id}`] = false;
      this.carAnimation?.cancel();
      this.resetCarPosition(this.carImage, id);
    }
  }

  private stopDriveButtonDisable() {
    this.buttonStart.disabled = false;
    this.buttonStop.disabled = true;
    this.buttonSelect.disabled = false;
    this.buttonRemove.disabled = false;
  }

  public async switchEngineToDriveMode(id: number): Promise<void> {
    const data = await RequestsApi.switchEngineToDriveMode(id);
    if (!data.success && storage.carToDriveStatus[`driveId${id}`] === true) {
      storage.carToDriveStatus[`driveId${id}`] = false;
      this.carAnimation?.cancel();
      //TODO implement the correct stop of the machine
      this.carImage.style.left = '50%';
    }
  }

  private animateCar(id: number, time: number): void {
    const carSize = this.carImage.clientWidth;
    this.carAnimation = this.carImage.animate(
      [{ left: this.startCarPosition }, { left: `calc(100% - ${carSize}px)` }],
      { duration: time },
    );
    this.carAnimation.play();
    this.carImage.style.left = `calc(100% - ${carSize}px)`;

    this.carAnimation.addEventListener('finish', () => {
      if (storage.carToDriveStatus[`driveId${id}`] === true) {
        this.checkingCarForWinner(id, time);
      }
    });
  }

  private checkingCarForWinner(id: number, time: number): void {
    if (!storage.isFinished && !storage.isWinner) {
      storage.winner = {
        id: id,
        wins: 1,
        time: Number((time / 1000).toFixed(2)),
        name: this.car.name,
        color: this.car.color,
      };
      storage.isFinished = true;
      storage.isWinner = true;
      this.createOrUpdateWinner(storage.winner);
    }
  }

  private async createOrUpdateWinner(winner: IWinner): Promise<void> {
    const winnerInDatabase = await RequestsApi.getWinner(winner.id);

    if (winnerInDatabase.status === 200) {
      winnerInDatabase.result.wins += 1;
      storage.winner.wins = winnerInDatabase.result.wins;
      await RequestsApi.updateWinner(winner);
    } else {
      await RequestsApi.createWinner(winner);
    }

    showWinnerNotification(storage.winner);
    setTimeout(() => winnerNotificationModal?.remove(), 1500);
  }

  private resetCarPosition(elem: HTMLElement, id: number) {
    storage.carToDriveStatus[`driveId${id}`] = false;
    elem.hidden = true;
    elem.style.left = this.startCarPosition;
    setTimeout(() => {
      elem.hidden = false;
    }, 100);
  }
}

export default CarTrack;
