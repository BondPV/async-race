import { twoFlagImage } from './twoFlagsImage';
import createElement from 'components/helpers/createElement';

class Header {
  parentElement: HTMLElement;

  constructor(parentElement: HTMLElement) {
    this.parentElement = parentElement;
  }

  public render(): void {
    const header = createElement('header', 'header');
    header.innerHTML = `
      <a class="button button_header" href="#main">Garage</a>
      <div class="header__image">
        ${twoFlagImage}
      </div>
      <a class="button button_header" href="#winners">Winners</a>
        `;
    this.parentElement.prepend(header);
  }
}

export default Header;
