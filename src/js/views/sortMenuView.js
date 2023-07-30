import View from './View';
class SortMenuView extends View {
  _parentElement = document.querySelector('.sort-menu-display');

  addHandlerSort(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.sort-by-btn');
      if (!btn) return;
      const upDown = btn.dataset.up ? btn.dataset.up : btn.dataset.down;

      handler(upDown);
    });
  }
  generateMarkup(data) {
    return `
    <div class="sort-menu">
               <div class="query-results">
                 <h3 class="query">Searched : <span>${data[0]}</span></h3>
                 <h3 class="results-number">Results : <span>${data[1]}</span></h3>
               </div>
               <div class="sort-by">
                 <h2>cooking-time</h2>
                 <span class="sort-by-btns"
                   ><button data-up="up"  class="sort-by-btn">&uarr;</button
                   ><button data-down="down"  class="sort-by-btn">&darr;</button></span
                 >
               </div>  
     </div>
    `;
  }
}
export default new SortMenuView();
