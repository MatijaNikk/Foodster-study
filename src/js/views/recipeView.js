import View from './View';
import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');

  addHandlerShoplist(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.recipe-shopcart-btn');
      if (!btn) return;
      const list = document.querySelectorAll('.ingredient');
      const liArr = [];
      list.forEach(li => {
        const liText = li.innerText;
        liArr.push(liText);
      });
      handler(liArr);
    });
  }
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev =>
      window.addEventListener(ev, function () {
        handler();
      })
    );
  }
  addHandlerGoBack(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.go-back');
      if (!btn) return;
      history.back();
      handler();
    });
  }
  addHandlerUpdate(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.update-btn');
      if (!btn) return;
      const upDown = btn.dataset.update;

      handler(upDown);
    });
  }
  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.update-bookmark');
      if (!btn) return;
      btn.dataset.update === 'true'
        ? (btn.dataset.update = 'false')
        : (btn.dataset.update = 'true');
      const updateTo = btn.dataset.update;
      handler(updateTo);
    });
  }
  generateMarkup(recipe) {
    return `
    <div class="recipe-image">

    <button class="go-back">
      <svg class="">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      GO BACK
    </button>
    <img src="${recipe.image_url}" alt="${recipe.title}" />
  </div>
  <div class="recipe-name"><h1 class="recipe-name-header">${
    recipe.title
  }</h1></div>
  
  <div class="recipe-data-container">
    <div class="recipe-data">
      <div>
        <svg class="">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <p>
          <span class="highlight">${recipe.cooking_time}</span>
          MIN<span class="delete">UTES</span>
        </p>
      </div>
      <div>
        <svg class="">
          <use href="${icons}#icon-users"></use>
        </svg>
        <p>
          <span class="highlight">${recipe.servings}</span>
          SERV<span class="delete">INGS</span>
        </p>
      </div>
      <div>
        <button data-update="up" class="update-btn">
          <svg class="">
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
        <button data-update="down" class="update-btn">
          <svg class="">
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
      </div>
    </div>
    <div class="recipe-bookmark-shopcart">
      <div><h3 class="delete">ADD TO :</h3></div>
      <div>
        <button class="recipe-shopcart-btn">
          <svg class="">
            <use href="${icons}#icon-shopcart"></use>
          </svg>
        </button>
        <button class="update-bookmark" data-update="${
          recipe.bookmarked ? 'true' : 'false'
        }">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      recipe.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </button>
      </div>
    </div>
  </div>
  <div class="recipe-ingredients">
    <h2 class="recipe-ingredients-header">RECIPE INGREDIENTS</h2>
    <ul class="ingredients">
    ${recipe.ingredients.map(this.generateMarkupIngredient).join('')}
    </ul>
  </div>
  <div class="recipe-publisher-link">
    <h2 class="publisher-header">HOW TO COOK IT</h2>
    <p class="publisher-paragraph">
      This recipe was carefully designed and tested by
      <span class="highlight">${recipe.publisher}</span>. Please check
      out directions at their website.
    </p>
    <a href="${recipe.source_url}"> 
    <button class="publisher-button">
      DIRECTIONS
      <svg class="">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button></a>
  </div>
</div> 
  `;
  }
  generateMarkupIngredient(ing) {
    return `
  <li class="ingredient">
        <svg class="">
          <use href="${icons}#icon-check"></use>
        </svg>
        <p>${ing.quantity ? fracty(ing.quantity) : ''} ${
      ing.unit ? ing.unit : ''
    } ${ing.description ? ing.description : ''}</p>
      </li>
  `;
  }
}

export default new RecipeView();
