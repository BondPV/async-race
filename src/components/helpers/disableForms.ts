export function disableForms(form: HTMLFormElement, key: boolean) {
  for (const elem of form.elements) {
    if (elem instanceof HTMLInputElement || elem instanceof HTMLButtonElement) {
      elem.disabled = key;
    }
  }
}
