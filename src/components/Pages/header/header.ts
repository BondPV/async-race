import { twoFlagImage } from './twoFlagsImage';

class Header {
  constructor(parentElement: HTMLElement) {
    const header = document.createElement('header');
    header.classList.add('header');
    header.innerHTML = `
      <a class="button button_header" href="#main">Garage</a>
      <div class="header__image">
        ${twoFlagImage}
      </div>
      <a class="button button_header" href="#winners">Winners</a>
        `;
    parentElement.prepend(header);
  }
}

export default Header;
