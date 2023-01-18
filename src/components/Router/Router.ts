import MainPage from 'components/Pages/MainPage';
import WinnersPage from 'components/Pages/WinnersPage';
import { Pages } from 'types/enums';

class Router {
  container: HTMLElement;

  private location: Location;

  private currentPage: MainPage | WinnersPage | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
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
      this.currentPage = new MainPage(this.container);
    }

    if (hash === Pages.Winners) {
      this.currentPage?.removePage();
      this.currentPage = new WinnersPage(this.container);
    }
  }
}

export default Router;
