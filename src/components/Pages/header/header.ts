class Header {
  constructor(parentElement: HTMLElement) {
    const header = document.createElement('header');
    header.classList.add('header');
    header.innerHTML = `
      <a class="button button_header" href="#main">Main Page</a>
      <div class="header__image">
        <img src="assets/2flags.svg" alt="flags">
      </div>
      <a class="button button_header" href="#winners">Winners Page</a>
        `;
    parentElement.append(header);
  }
}

export default Header;
