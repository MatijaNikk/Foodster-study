import View from './View';
import icons from 'url:../../img/icons.svg';
class AddRecipeView extends View {
  _parentElement = document.querySelector('.search-results');
  _addRecipeElement = document.querySelector('.nav-add-recipe');
  addHandlerAddRecipe(handler) {
    this._addRecipeElement.addEventListener('click', function (e) {
      handler();
    });
  }
}
export default new AddRecipeView();
