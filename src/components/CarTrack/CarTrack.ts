import { ICar } from 'types/interfaces';
import createElement from 'components/helpers/createElement';
import { CarImage } from 'components/Car/CarImage';
import { flagImage } from './flagImage';

class CarTrack {
  car: ICar;

  constructor(car: ICar) {
    this.car = car;
  }

  public render(): HTMLElement {
    const carTrack = createElement('div', 'garage__car');

    const carName = createElement('span', 'garage__name');
    carName.innerText = this.car.name;

    const track = createElement('div', 'garage__track');

    const carImage = createElement('div', 'garage__car-image');
    carImage.innerHTML = `${CarImage(this.car.color)}`;

    const flagImg = createElement('div', 'garage__flag-image');
    flagImg.innerHTML = `${flagImage}`;

    track.append(carImage);
    track.append(flagImg);

    carTrack.append(this.createButtonsSelection());
    carTrack.append(carName);
    carTrack.append(this.createButtonsControls());
    carTrack.append(track);

    return carTrack;
  }

  private createButtonsSelection(): HTMLElement {
    const buttonsSelection = createElement('div', 'garage__buttons-selection');

    const buttonSelect = createElement(
      'button',
      ['button', 'button_car'],
      `select-${this.car.id}`,
    ) as HTMLButtonElement;
    buttonSelect.innerText = 'Select';

    const buttonRemove = createElement(
      'botton',
      ['button', 'button_car'],
      `remove-${this.car.id}`,
    ) as HTMLButtonElement;
    buttonRemove.innerText = 'Remove';

    buttonsSelection.append(buttonSelect);
    buttonsSelection.append(buttonRemove);

    return buttonsSelection;
  }

  private createButtonsControls(): HTMLElement {
    const buttonsControls = createElement('div', 'garage__buttons-controls');

    const buttonStart = createElement('button', 'button', `start-${this.car.id}`) as HTMLButtonElement;
    buttonStart.innerText = 'start';
    buttonsControls.append(buttonStart);

    const buttonStop = createElement('button', 'button', `stop-${this.car.id}`) as HTMLButtonElement;
    buttonStop.innerText = 'stop';
    buttonStop.disabled = true;
    buttonsControls.append(buttonStop);

    return buttonsControls;
  }
}

export default CarTrack;
