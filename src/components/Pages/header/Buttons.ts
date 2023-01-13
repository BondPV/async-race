class ButtonsNav {
  constructor(parentElement: HTMLElement) {
    const btns = document.createElement('nav');
    btns.classList.add('nav');
    btns.innerHTML = `
        <a href="#main" class="nav__btn">Main Page</a>
        <a href="#winners" class="nav__btn">Winners Page</a>
        `;
    parentElement.append(btns);
  }
}

export default ButtonsNav;
