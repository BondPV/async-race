import createElement from 'components/helpers/createElement';

class Footer {
  parentElement: HTMLElement;

  constructor(parentElement: HTMLElement) {
    this.parentElement = parentElement;
  }

  public render(): void {
    const footer = createElement('footer', 'footer');
    footer.innerHTML = `
      <a href="https://rs.school/js/" target="_blank" rel="noopener">
        <img src="assets/rs-school-js.svg" alt="Rolling Scopes School" class="footer__logo">
      </a>
      <div class="footer__copyright">
        <span>2023</span>
        <a href="https://github.com/BondPV" target="_blank" rel="noopener" class="footer__github">BondPV</a>
      </div>`;
    this.parentElement.append(footer);
  }
}

export default Footer;
