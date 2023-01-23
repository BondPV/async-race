import { ICar, ICars, IEngine, IDriveStatus, IWinner, IWinners } from 'types/interfaces';
import { ModeEngine } from 'types/enums';
import { SortOptionsType, SortOrderType } from 'types/types';
import { GARAGE_URL, ENGINE_URL, WINNERS_URL, CARS_PER_PAGE, WINNERS_PER_PAGE } from 'constants/Constants';

class RequestsApi {
  static async getsCars(page = 1): Promise<ICars> {
    const url = `${GARAGE_URL}?_page=${page}&_limit=${CARS_PER_PAGE}`;

    try {
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const cars: Required<ICar>[] = await response.json();
      const count = response.headers.get('X-Total-Count');

      return {
        cars: await Promise.all(cars),
        count,
      };
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  static async getCar(id: number): Promise<Required<ICar>> {
    const url = `${GARAGE_URL}/${id}`;

    try {
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  static async createCar(car: ICar): Promise<ICar> {
    const url = `${GARAGE_URL}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(car),
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  static async deleteCar(id: number): Promise<void> {
    const url = `${GARAGE_URL}/${id}`;

    try {
      const response = await fetch(url, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  static async updateCar(car: ICar): Promise<ICar> {
    const url = `${GARAGE_URL}/${car.id}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: car.name, color: car.color }),
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  static async controlEngine(
    id: number,
    status: ModeEngine.start | ModeEngine.stop,
  ): Promise<{ status: number; result: IEngine }> {
    const url = `${ENGINE_URL}?id=${id}&status=${status}`;

    try {
      const response = await fetch(url, { method: 'PATCH' });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      return {
        status: response.status,
        result: await response.json(),
      };
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  static async switchEngineToDriveMode(id: number): Promise<IDriveStatus> {
    const url = `${ENGINE_URL}?id=${id}&status=${ModeEngine.drive}`;

    try {
      const response = await fetch(url, { method: 'PATCH' });

      if (!response.ok) {
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  static async getWinners(page = 1, sort?: SortOptionsType, order?: SortOrderType): Promise<IWinners> {
    const url = `${WINNERS_URL}?_page=${page}&_limit=${WINNERS_PER_PAGE}${this.getWinnersFilter(sort, order)}`;
    try {
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const winners: IWinner[] = await response.json();
      const count = response.headers.get('X-Total-Count');

      return {
        winners: await Promise.all(winners),
        count,
      };
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  static getWinnersFilter(sort?: SortOptionsType, order?: SortOrderType): string {
    return sort && order ? `&_sort=${sort}&_order=${order}` : '';
  }

  static async getWinner(id: number): Promise<{ status: number; result: IWinner }> {
    const url = `${WINNERS_URL}/${id}`;

    try {
      const response = await fetch(url, { method: 'GET' });
      const result: IWinner = await response.json();

      return {
        status: response.status,
        result: result,
      };
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  static async createWinner(winner: IWinner): Promise<IWinner> {
    const url = `${WINNERS_URL}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: winner.id, wins: winner.wins, time: winner.time }),
      });
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  static async deleteWinner(id: number): Promise<void> {
    const url = `${WINNERS_URL}/${id}`;

    try {
      const response = await fetch(url, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  static async updateWinner(winner: IWinner): Promise<IWinner> {
    const url = `${WINNERS_URL}/${winner.id}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wins: winner.wins, time: winner.time }),
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

export default RequestsApi;
