function createElement(elem: string, elemClass?: string | string[], elemId?: string): HTMLElement {
  const el: HTMLElement = document.createElement(elem);

  if (typeof elemClass === 'string') {
    el.classList.add(elemClass);
  }

  if (typeof elemClass === 'object') {
    el.classList.add(...elemClass);
  }

  if (elemId) {
    el.id = elemId;
  }

  return el;
}

export default createElement;
