import Header from './header/header';
import Footer from './footer/footer';
import { CarImage } from 'components/Car/CarImage';

class MainPage {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderPage();
  }

  private renderPage() {
    new Header(this.container);

    const main: HTMLElement = document.createElement('main');
    main.classList.add('main');
    main.innerHTML = `
      <div class="garage">
        <h1 class="garage__title">Garage = 100 =</h1>
        <div class="settings">
          <div class="settings__field">
            <input class="settings__data" type="name" placeholder="car name">
            <input class="settings__color" type="color">
            <button class="button button_settings">Create</button>
          </div>
          <div class="settings__field">
            <input class="settings__data" type="name" disabled="">
            <input class="settings__color" type="color" disabled="">
            <button class="button button_settings" disabled="">Update</button>
          </div>
          <div class="settings__buttons">
            <button class="button button_settings">garage</button>
            <button class="button button_settings" disabled="">Reset</button>
            <button class="button button_settings">Generate cars</button>
          </div>
        </div>
        <div class="garage__list">
          <div class="garage__car">
            <div class="garage__buttons-selection">
              <button class="button button_car">Select</button>
              <button class="button button_car">Remove</button>
            </div>
            <span class="garage__name">Tesla</span>
            <div class="garage__buttons-controls">
              <button class="button">start</button>
              <button class="button" disabled="">stop</button>
            </div>
            <div class="garage__track">
              <div class="garage__car-image">
                ${CarImage()}
              </div>
              <div class="garage__flag-image">
                <img src="assets/flag.svg" alt="flag">
              </div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <button class="button" disabled="">Prev</button>
          <div class="pagination__page">1</div>
          <button class="button" disabled="">Next</button>
        </div>
      </div>`;
    this.container.append(main);

    new Footer(this.container);
  }

  public removePage() {
    this.container.innerHTML = '';
  }
}

export default MainPage;
