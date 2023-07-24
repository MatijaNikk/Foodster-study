import View from './View';
import icons from 'url:../../img/icons.svg';
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks-view');
  _navElement = document.querySelector('.nav-bar');
  _errorMessage =
    'You did not bookmark any recipe yet! Search for a recipe so you can bookmark it.';
  addHandlerPaginationBookmarks(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.page-navigation-btn');
      if (!btn) return;
      const page = +btn.dataset.page;
      handler(page);
    });
  }
  addHandlerBookmarkResult(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.result-bookmark-btn');
      if (!btn) return;
      if (btn.dataset.update === 'true') {
        const updateTo = 'false';
        const index = +btn.dataset.index;

        handler(updateTo, index);
      } else {
        const updateTo = 'true';
        const index = +btn.dataset.index;

        handler(updateTo, index);
      }
      /*  const updateTo =
        btn.dataset.update === 'true'
          ? (btn.dataset.update = 'false')
          : (btn.dataset.update = 'true'); */
    });
  }
  addHandlerRenderBookmarks(handler) {
    this._navElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.open-bookmark-list');
      if (!btn) return;
      const isList = 'true';
      window.location.hash = '';
      handler(isList);
    });
  }
  generateMarkup(results, page, recipeCount) {
    return `
    <ul class="results">
    ${results.map(this.generateMarkupResult).join('')}  
 </ul>
 <div class="bottom">
            <div class="page-navigation">
             
             ${this.generateMarkupPagination(results, page, recipeCount)}
            </div>
          </div>
 `;
  }
  generateMarkupResult(result, i) {
    return `
<li class="result">
<a href="#${result.id}" class="result-id">
  <div class="result-left-div">
    <figure class="result-image">
      <img src="${result.image_url}" alt="?" />
    </figure>
    <div class="result-description">
      <h4 class="result-name">${result.title}</h4>
      <p class="result-publisher">${result.publisher}</p>
    </div>
  </div>
  <div class="result-cooking-time">
    <svg class="">
      <use href="${icons}#icon-clock"></use>
    </svg>
    <h2 class="cooking-time">${result.cooking_time} minutes</h2>
  </div>
 <div class="result-btn-fake-div "></div>
</a>
<div class="result-add-bookmark">
<button data-index=${i} data-update="${
      result.bookmarked ? 'true' : 'false'
    }"class="result-bookmark-btn">
  <svg class="">
    <use href="${icons}#icon-bookmark${result.bookmarked ? '-fill' : ''}"></use>
  </svg>
  <h2 class="add-bookmark">${result.bookmarked ? 'Un' : 'Add'} bookmark</h2>
</button>
</div>
</li>`;
  }
  generateMarkupPagination(results, page, recipeCount) {
    const maxPages = Math.ceil(recipeCount / 10);
    const currPage = +page;

    if (currPage === 1 && maxPages > currPage) {
      return `
      <div class="page-navigation-btn-fake"></div>
    <h2 data-page="${currPage}" class="current-page">Page ${currPage}</h2>
    <button data-page="${currPage + 1}" class="page-navigation-btn page-next">
      Page ${currPage + 1}
      <svg class="">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
      `;
    }
    if (currPage > 1 && maxPages > currPage) {
      return `
        <button data-page="${
          currPage - 1
        }"  class="page-navigation-btn page-prev">
          <svg class="">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          Page ${currPage - 1} 
        </button>
        <h2 data-page="${currPage}" class="current-page">Page ${currPage}</h2>
        <button data-page="${
          currPage + 1
        }" class="page-navigation-btn page-next">
          Page ${currPage + 1} 
          <svg class="">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }
    if (currPage > 1 && maxPages === currPage) {
      return `
        <button data-page="${
          currPage - 1
        }"  class="page-navigation-btn page-prev">
          <svg class="">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          Page ${currPage - 1} 
        </button>
      <h2 data-page="${currPage}" class="current-page">Page ${currPage}</h2>
      <div class="page-navigation-btn-fake"></div>
      `;
    }
    return `
    <h2 data-page="${currPage}" class="current-page">Page ${currPage}</h2>
    `;
  }
}
export default new BookmarksView();
