import MainPage from 'components/Pages/MainPage';
import WinnersPage from 'components/Pages/WinnersPage';
import { Pages } from 'types/enums';

const body = document.querySelector('body') as HTMLElement;

class Router {
  private location: Location;

  private currentPage: MainPage | WinnersPage | null = null;

  constructor() {
    this.location = window.location;
    this.setPage(this.location.hash.slice(1));
    this.hashChange();
  }

  private hashChange() {
    window.addEventListener('hashchange', () => {
      if (this.currentPage) {
        this.currentPage.removePage();
      }

      this.setPage(this.location.hash.slice(1));
    });
  }

  private setPage(hash: string) {
    if (window.location.hash.length === 0 || hash === Pages.Main) {
      this.currentPage?.removePage();
      this.currentPage = new MainPage(body);
    }

    if (hash === Pages.Winners) {
      this.currentPage?.removePage();
      this.currentPage = new WinnersPage(body);
    }
  }
}

export default Router;
