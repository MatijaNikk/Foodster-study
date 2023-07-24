import View from './View';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.search');

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const query = document.querySelector('.search-input').value;
      document.querySelector('.search-input').value = '';
      document.querySelector('.recipe').innerHTML = '';
      window.location.hash = '';
      handler(query);
    });
  }
}
export default new ResultsView();
