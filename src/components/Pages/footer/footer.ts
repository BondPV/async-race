class Footer {
  constructor(parentElement: HTMLElement) {
    const footer: HTMLElement = document.createElement('footer');
    footer.classList.add('footer');
    footer.innerHTML = this.renderFooter();
    parentElement.append(footer);
  }

  private renderFooter(): string {
    return `
      <a href="https://rs.school/js/" target="_blank" rel="noopener">
        <img src="assets/rs-school-js.svg" alt="Rolling Scopes School" class="footer__logo">
      </a>
      <div class="footer__copyright">
        <span>2023</span>
        <a href="https://github.com/BondPV" target="_blank" rel="noopener" class="footer__github">BondPV</a>
      </div>`;
  }
}

export default Footer;
