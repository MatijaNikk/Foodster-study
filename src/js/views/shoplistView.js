import View from './View';
import icons from 'url:../../img/icons.svg';
class ShoplistView extends View {
  _parentElement = document.querySelector('.search-results');
  _navElement = document.querySelector('.nav-bar');
  _errorMessage =
    'You did not add any ingredients to the shoplist yet! Open up a recipe and add its ingredients to the list.';

  addHandlerShoplistResults(handler) {
    this._navElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.open-shoplist');
      if (!btn) return;
      window.location.hash = '';
      handler();
    });
  }
  addEventDeleteList(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.shoplist-delete-all-btn');
      if (!btn) return;
      document.querySelector('.shoplist-ingredients').innerHTML = '';
      handler();
    });
  }

  generateMarkup(list) {
    if (list === 'false') {
      console.log(1);
      this.renderError();
    }
    return `
    <div class="shoplist-container">
            <h2 class="shoplist-header">SHOPLIST INGREDIENTS :</h2>
            
            <ul class="shoplist-ingredients">
            ${list.map(this.generateMarkupIngredients).join('')}
              
              <li class="shoplist-ingredient shoplist-delete-all">
                <button class="shoplist-delete-all-btn">
                  DELETE
                  <svg class="">
                    <use href="${icons}#icon-delete"></use>
                  </svg>
                </button>
              </li>
            </ul>
          </div>
    `;
  }
  generateMarkupIngredients(ing) {
    return `
    <li class="shoplist-ingredient">
                <svg class="">
                  <use href="${icons}#icon-check"></use>
                </svg>
               ${ing}
              </li>
  `;
  }
}
export default new ShoplistView();
