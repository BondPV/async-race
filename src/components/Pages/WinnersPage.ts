import ButtonsNav from './header/Buttons';

class WinnersPage {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderPage();
  }

  private renderPage() {
    new ButtonsNav(this.container);
  }

  public removePage() {
    this.container.innerHTML = '';
  }
}

export default WinnersPage;
