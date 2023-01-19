import { carBrand, carModel } from './CarsNames';
import { ICar } from 'types/interfaces';
import { DEFAULT_RANDOM_COUNT } from 'constants/Constants';

class Car {
  static generateRandomCarName(): string {
    const brand = carBrand[Math.floor(Math.random() * carBrand.length)];
    const model = carModel[Math.floor(Math.random() * carModel.length)];
    return `${brand} ${model}`;
  }

  static generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    const sampleColor = '#ff0000';
    let color = '#';

    for (let i = 0; i < sampleColor.slice(1).length; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }

    return color;
  }

  static generateRandomCars(count = DEFAULT_RANDOM_COUNT): ICar[] {
    return new Array(count).fill(1).map(() => ({
      name: this.generateRandomCarName(),
      color: this.generateRandomColor(),
    }));
  }
}

export default Car;
