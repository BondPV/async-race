import { carBrand, carModel } from './CarsNames';
import { ICar } from 'types/interfaces';

const DEFAULT_RANDOM_COUNT = 100;

class Car {
  private generateRandomCarName(): string {
    const brand = carBrand[Math.floor(Math.random() * carBrand.length)];
    const model = carModel[Math.floor(Math.random() * carModel.length)];
    return `${brand} ${model}`;
  }

  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    const sampleColor = '#ff0000';
    let color = '#';

    for (let i = 0; i < sampleColor.slice(1).length; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }

    return color;
  }

  public generateRandomCars(count = DEFAULT_RANDOM_COUNT): ICar[] {
    return new Array(count).fill(1).map(() => ({
      name: this.generateRandomCarName(),
      color: this.generateRandomColor(),
    }));
  }
}

export default Car;
