import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  /**
   *We use this function to render all the data we get from the model in the view
   * @param {Object | Object[] | Array} data data needed to display the correct view
   * @param {number} [page] used when we need to render pagination or results
   * @param {number} [recipeCount] used when we need to render pagination or results
   */
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
  /**
   *We use this function to update all the data we have on the page to the data we get from the model in the view
   *Here we create a alroritm that updates only the changed elements without rendering the rest, but it has some problems so we do not use it every time we should
   * @param {Object | Object[] | Array} data
   * @param {number} [page] used when we need to render pagination or results
   * @param {number} [recipeCount] used when we need to render pagination or results
   */
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

  /**
   * We use this to clear the views parent element
   */
  clear() {
    this._parentElement.innerHTML = '';
  }
  /**
   * We use this to clear and insert the markup at the same time
   * @param {string} markup a string of html elements
   */
  clearAndInsert(markup) {
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * We use this to render a spinner on the parent element while the view loads
   */
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
  /**
   *
   * @param {*} errorMessage
   */
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
