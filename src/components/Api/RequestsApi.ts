import { ICar, ICars, IEngine, IDriveStatus, IWinner, IWinners } from 'types/interfaces';
import { ModeEngine } from 'types/enums';
import { GARAGE_URL, ENGINE_URL, WINNERS_URL, CARS_PER_PAGE, WINNERS_PER_PAGE } from 'constants/Constants';

class RequestsApi {
  public async getsCars(page = 1): Promise<ICars> {
    const url = `${GARAGE_URL}?_page=${page}&_limit=${CARS_PER_PAGE}`;

    try {
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const cars: ICar[] = await response.json();
      const count = response.headers.get('X-Total-Count');

      return {
        cars: await Promise.all(cars),
        count,
      };
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  public async getCar(id: number): Promise<ICar> {
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

  public async createCar(car: ICar): Promise<ICar> {
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

  public async deleteCar(id: number): Promise<void> {
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

  public async updateCar(car: ICar): Promise<ICar> {
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

  public async controlEngine(
    id: number,
    status: ModeEngine,
  ): Promise<{ status: number; result: IEngine } | IDriveStatus> {
    const url = `${ENGINE_URL}?id=${id}&status=${status}`;

    try {
      const response = await fetch(url, { method: 'PATCH' });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      if (status === ModeEngine.drive) {
        return { success: true };
      } else {
        return {
          status: response.status,
          result: await response.json(),
        };
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  public async getWinners(page = 1, sort?: string | null, order?: string | null): Promise<IWinners> {
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

  private getWinnersFilter(sort?: string | null, order?: string | null): string {
    return sort && order ? `&_sort=${sort}&_order=${order}` : '';
  }

  public async getWinner(id: number): Promise<IWinner> {
    const url = `${WINNERS_URL}/${id}`;

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

  public async createWinner(winner: IWinner): Promise<IWinner> {
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

  public async deleteWinner(id: number): Promise<void> {
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

  public async updateWinner(winner: IWinner): Promise<IWinner> {
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