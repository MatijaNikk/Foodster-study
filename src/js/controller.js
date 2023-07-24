import recipeView from './views/recipeView';
import * as model from './model';
import resultsView from './views/resultsView';
import searchView from './views/searchView';
import sortMenuView from './views/sortMenuView';
import shoplistView from './views/shoplistView';
import bookmarksView from './views/bookmarksView';
import sortMenuBookmarksView from './views/sortMenuBookmarksView';

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultsView.clear();
    sortMenuView.clear();
    bookmarksView.clear();
    shoplistView.clear();
    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err);
    console.error(err);
  }
};

const controlSortMenu = function (query, resultsNumb) {
  sortMenuView.render([query, resultsNumb]);
};
const controlSorting = async function (upDown) {
  model.sortSearchResults(upDown);
  resultsView.update(
    model.state.results.paginationRecipes,
    model.state.results.page,
    model.state.results.recipeCount
  );
};
const controlSortingBookmarks = function (upDown) {
  model.sortSearchResults(upDown);
  bookmarksView.update(
    model.state.results.paginationRecipesBookmarks,
    model.state.results.page,
    model.state.results.recipeCountBookmarks
  );
};

const controlResults = async function (data) {
  try {
    const query = data;
    if (!query) return;
    recipeView.clear();
    bookmarksView.clear();
    shoplistView.clear();
    resultsView.renderSpinner();
    await model.loadSearchResults(query);
    controlSortMenu(query, model.state.results.recipes.length);
    model.updateResults();
    model.updateIsBookmarkList();
    if (model.state.results.recipeCount === 0) throw new Error();
    resultsView.render(
      model.state.results.paginationRecipes,
      model.state.results.page,
      model.state.results.recipeCount
    );
  } catch (err) {
    resultsView.renderError(err);
    console.error(err);
  }
};
const controlReResults = function () {
  const query = model.state.results.query;
  if (!query) return;
  resultsView.renderSpinner();
  recipeView.clear();
  shoplistView.clear();
  if (model.state.results.isBookmarkList === true) {
    model.loadPagination(model.state.results.page);
    console.log(
      model.state.results.paginationRecipesBookmarks,
      model.state.results.page,
      model.state.results.recipeCountBookmarks
    );
    bookmarksView.render(
      model.state.results.paginationRecipesBookmarks,
      model.state.results.page,
      model.state.results.recipeCountBookmarks
    );
    sortMenuBookmarksView.render([
      'bookmarks',
      model.state.results.bookmarks.length,
    ]);
    return;
  }
  controlSortMenu(query, model.state.results.recipes.length);
  model.updateIsBookmarkList();
  bookmarksView.clear();
  model.updateResults();
  resultsView.render(
    model.state.results.paginationRecipes,
    model.state.results.page,
    model.state.results.recipeCount
  );
};
const controlPagination = function (page) {
  model.updateResults();
  model.loadPagination(page);
  if (model.state.results.isBookmarkList === true) {
    bookmarksView.render(
      model.state.results.paginationRecipesBookmarks,
      model.state.results.page,
      model.state.results.recipeCountBookmarks
    );
    return;
  }
  resultsView.render(
    model.state.results.paginationRecipes,
    model.state.results.page,
    model.state.results.recipeCount
  );
};
const controlServings = function (upDown) {
  model.updateServings(upDown);
  recipeView.update(model.state.recipe);
};
const controlBookmarks = function (updateTo) {
  model.updateBookmark(updateTo);
  recipeView.update(model.state.recipe);
};
const controlBookmarksResults = function (updateTo, index) {
  model.loadPagination(model.state.results.page);
  model.updateBookmarkResults(updateTo, index);
  resultsView.update(
    model.state.results.paginationRecipes,
    model.state.results.page,
    model.state.results.recipeCount
  );
};
const controlBookmarksResults2 = function (updateTo, index) {
  try {
    model.loadPagination(model.state.results.page);
    model.updateBookmarkResults(updateTo, index);
    sortMenuBookmarksView.render([
      'bookmarks',
      model.state.results.recipeCountBookmarks,
    ]);
    if (model.state.results.bookmarks.length < 1) throw new Error();
    bookmarksView.render(
      model.state.results.paginationRecipesBookmarks,
      model.state.results.page,
      model.state.results.recipeCountBookmarks
    );
  } catch (err) {
    bookmarksView.renderError();
  }
};
const controlBookmarkList = function (isList) {
  try {
    recipeView.clear();
    resultsView.clear();
    shoplistView.clear();
    sortMenuView.clear();
    model.updateIsBookmarkList(isList);
    model.loadPagination();
    if (model.state.results.bookmarks.length < 1) throw new Error();
    sortMenuBookmarksView.render([
      'bookmarks',
      model.state.results.bookmarks.length,
    ]);
    bookmarksView.render(
      model.state.results.paginationRecipesBookmarks,
      model.state.results.page,
      model.state.results.recipeCountBookmarks
    );
  } catch (err) {
    bookmarksView.renderError();
  }
};
const controlShoplist = function (liArr) {
  model.updateShopList(liArr);
};
const controlShoplistResults = function () {
  try {
    recipeView.clear();
    resultsView.clear();
    sortMenuView.clear();
    bookmarksView.clear();
    if (model.state.results.shoplistIngredients.length < 1) throw new Error();
    shoplistView.render(model.state.results.shoplistIngredients);
  } catch (err) {
    shoplistView.renderError();
  }
};
const controlEmptyShoplist = function () {
  shoplistView.renderError();
  model.removeShopList();
};

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlResults);
  sortMenuView.addHandlerSort(controlSorting);
  sortMenuBookmarksView.addHandlerSortBookmarks(controlSortingBookmarks);
  recipeView.addHandlerGoBack(controlReResults);
  resultsView.addHandlerPagination(controlPagination);
  bookmarksView.addHandlerPaginationBookmarks(controlPagination);
  recipeView.addHandlerUpdate(controlServings);
  recipeView.addHandlerBookmark(controlBookmarks);
  recipeView.addHandlerShoplist(controlShoplist);
  resultsView.addHandlerBookmarkResult(controlBookmarksResults);
  bookmarksView.addHandlerBookmarkResult(controlBookmarksResults2);
  bookmarksView.addHandlerRenderBookmarks(controlBookmarkList);
  shoplistView.addHandlerShoplistResults(controlShoplistResults);
  shoplistView.addEventDeleteList(controlEmptyShoplist);
};
init();
