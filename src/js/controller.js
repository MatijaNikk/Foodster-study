import recipeView from './views/recipeView';
import * as model from './model';
import resultsView from './views/resultsView';
import searchView from './views/searchView';
import sortMenuView from './views/sortMenuView';
import shoplistView from './views/shoplistView';
import bookmarksView from './views/bookmarksView';
import sortMenuBookmarksView from './views/sortMenuBookmarksView';

/**
 * With this function we get the id from the hash, render a loading spinner, clear all other views and then load the recipe in the model and then render it in the view, if we get an error loading the recipe we render the error on the page
 * @returns if we dont have any id in the hash we return
 */
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
  }
};
/**
 *We use this function to render the sort menu view with the right query and the result number
 * @param {string} query
 * @param {number} resultsNumb
 */
const controlSortMenu = function (query, resultsNumb) {
  sortMenuView.render([query, resultsNumb]);
};

/**
 * We use this function so whenever we click on the sort buttons in the results view we sort the result array accordingly and then update the view
 * @param {string} upDown string that is either 'up' or 'down'
 */
const controlSorting = async function (upDown) {
  model.sortSearchResults(upDown);
  resultsView.update(
    model.state.results.paginationRecipes,
    model.state.results.page,
    model.state.results.recipeCount
  );
};

/**
 *We use this function so whenever we click on the sort buttons in the bookmarks view we sort the result array accordingly and then update the view
 * @param {string} upDown string that is either 'up' or 'down'
 */
const controlSortingBookmarks = function (upDown) {
  model.sortSearchResults(upDown);
  bookmarksView.update(
    model.state.results.paginationRecipesBookmarks,
    model.state.results.page,
    model.state.results.recipeCountBookmarks
  );
};

/**
 * We use this function to load the results from the model we call with the query and with that clear all other views and render a spinner
 * We also display an error if the recipe count is 0, aka the query we got doesn't return us any results
 * @param {string} data the query we get from the submit
 * @returns if we have no query submited we return
 */
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
    resultsView.renderError();
    console.error(err);
  }
};
/**
 * We call this function every time we exit a recipe so we load the right data depending if the are in the bookmarks list or the result list
 * @returns if we have no query we return
 */
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
/**
 * We use this function to update results and load the pagination whenever we click on the pagination buttons
 * @param {number} page a number we get from the pagination dataset and we use said data to display the right recipes on the right page
 * @returns if we are in the bookmarks view we return so we dont render a results view
 */
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
/**
 * We use this function to update the servings every time a servings update button is clicked, and then display that updated data on the recipe view
 * @param {string} upDown string that is either 'up' or 'down'
 */
const controlServings = function (upDown) {
  model.updateServings(upDown);
  recipeView.update(model.state.recipe);
};
/**
 * We use this function to update the bookmarks every time a bookmark button is clicked, and then display that updated data on the recipe view
 * @param {string} updateTo string that is either 'true' or 'false'
 */
const controlBookmarks = function (updateTo) {
  model.updateBookmark(updateTo);
  recipeView.update(model.state.recipe);
};
/**
 * We use this function to update the bookmarks every time a bookmark button is clicked, and then display that updated data on the results view
 * @param {string} updateTo string that is either 'true' or 'false'
 * @param {number} index a number of a result we clicked on
 */
const controlBookmarksResults = function (updateTo, index) {
  model.loadPagination(model.state.results.page);
  model.updateBookmarkResults(updateTo, index);
  resultsView.update(
    model.state.results.paginationRecipes,
    model.state.results.page,
    model.state.results.recipeCount
  );
};
/**
 * We use this function to update the bookmarks every time a bookmark button is clicked, and then display that updated data on the bookmarks view
 * @param {string} updateTo string that is either 'true' or 'false'
 * @param {number} index a number of a result we clicked on
 */
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
/**
 *We use this function to render a bookmarks view on the page while clearing other views
 * @param {string} isList string that is either 'true' or 'false'
 */
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
/**
 * We use this function to update the shoplist
 * @param {Array} liArr Array that contains a list of ingredients we got from the recipe that we need to add in the shoplist array
 */
const controlShoplist = function (liArr) {
  model.updateShopList(liArr);
};

/**
 * We use this function to render the shoplist view
 */
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

/**
 * We use this function to empty out the shoplist array and render a message
 */
const controlEmptyShoplist = function () {
  shoplistView.renderError();
  model.removeShopList();
};

/**
 * We use this function and call it immediatelly so we connect all the views with their corresponding control functions
 */
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
