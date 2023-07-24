import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  render(data, page, recipeCount) {
    this._data = data;
    if (page) {
      const markup = this.generateMarkup(this._data, page, recipeCount);
      this.clearAndInsert(markup);
      return;
    }
    const markup = this.generateMarkup(this._data);
    this.clearAndInsert(markup);
  }

  update(data, page, recipeCount) {
    this._data = data;
    const markup = this.generateMarkup(this._data, page, recipeCount);
    const newDom = document.createRange().createContextualFragment(markup);
    const newElements = newDom.querySelectorAll('*');
    const currElements = this._parentElement.querySelectorAll('*');
    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  clear() {
    this._parentElement.innerHTML = '';
  }
  clearAndInsert(markup) {
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderSpinner() {
    const markup = `
    <div class="spinner">
    <svg class="svg-spinner">
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>
    `;
    this.clearAndInsert(markup);
  }
  renderError(errorMessage = this._errorMessage) {
    const markup = `
    <div class="search-results">
          <div class="message">
            <svg class="">
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
            <h2 class="messege-header">
              ${errorMessage}
            </h2>
          </div>
    `;
    this.clearAndInsert(markup);
  }
}
