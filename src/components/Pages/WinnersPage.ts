class WinnersPage {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderPage();
  }

  private renderPage() {}

  public removePage() {
    this.container.innerHTML = '';
  }
}

export default WinnersPage;
