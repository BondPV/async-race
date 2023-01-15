import Header from './header/header';
import Footer from './footer/footer';

class WinnersPage {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderPage();
  }

  private renderPage() {
    new Header(this.container);
    new Footer(this.container);
  }

  public removePage() {
    this.container.innerHTML = '';
  }
}

export default WinnersPage;
