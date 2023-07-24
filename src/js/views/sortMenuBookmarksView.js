import View from './View';
class SortMenuViewBookmarks extends View {
  _parentElement = document.querySelector('.sort-menu-display');

  addHandlerSortBookmarks(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.sort-by-btn2');
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
                 <h2>Sort by : cooking-time</h2>
                 <span class="sort-by-btns"
                   ><button data-up="up"  class="sort-by-btn2">&uarr;</button
                   ><button data-down="down"  class="sort-by-btn2">&darr;</button></span
                 >
               </div>  
     </div>
    `;
  }
}
export default new SortMenuViewBookmarks();
