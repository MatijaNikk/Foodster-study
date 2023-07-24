import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { getJSON } from './helper';

/**
 * We store all the important data here.
 */
export const state = {
  recipe: {},
  results: {
    recipes: [],
    paginationRecipes: [],
    paginationRecipesBookmarks: [],
    shoplistIngredients: [],
    isBookmarkList: false,
    recipeCount: 0,
    recipeCountBookmarks: 0,
    query: '',
    bookmarks: [],
    page: 1,
    resultsPerPage: 10,
  },
};

/**
 * We call this function in the controller and we get the id from the hash in the URL.
 * @param {string} id id is used to fetch the right code from the API.
 */
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    state.recipe = data.data.recipe;

    if (state.results.bookmarks.some(rec => rec.id === state.recipe.id)) {
      const index = state.results.bookmarks.findIndex(
        rec => rec.id === state.recipe.id
      );
      if (index !== -1) {
        state.recipe = state.results.bookmarks[index];
      }
    }
  } catch (err) {
    throw err;
  }
};

/**
 * We call this function in the controller and we use the query to load the right search results.
 * Because the API doesn't give us the search results data that we want we have to loop over those results and get the id so we can do another API call and push that recipe data into the array so we get the right data.
 *We use the Promise.all method because otherwise we get an pending promise.
 *This many API calls makes the API reach its request limit (100 requests per hour) very fast so dont search for different queries too much.
 * @param {string} query we get the query from the input elements value.
 */
export const loadSearchResults = async function (query) {
  try {
    state.results.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.results.recipes = await Promise.all(
      data.data.recipes.map(async recipe => {
        try {
          const id = recipe.id;
          const data = await getJSON(`${API_URL}/${id}`);
          let recipez = data.data.recipe;
          if (state.results.bookmarks.some(rec => rec.id === recipez.id)) {
            const index = state.results.bookmarks.findIndex(
              rec => rec.id === recipez.id
            );
            if (index !== -1) {
              recipez = state.results.bookmarks[index];
            }
          } else {
            recipez.bookmarked = false;
          }
          return recipez;
        } catch (err) {
          console.error(`${err} pepega`);
        }
      })
    );
  } catch (err) {
    throw err;
  }
};
/**
 * We update the results in case there is a bookmarked recipe with the same id as the one we have in the recipes array
 */
export const updateResults = function () {
  const arr = [];
  state.results.recipes.forEach(recipe => {
    if (state.results.bookmarks.some(rec => rec.id === recipe.id)) {
      const index = state.results.bookmarks.findIndex(
        rec => rec.id === recipe.id
      );
      if (index !== -1) {
        recipe = state.results.bookmarks[index];
      }
    }
    arr.push(recipe);
  });
  state.results.recipes = arr;

  loadPagination();
};

/**
 * We call this function in the controller and we use the string we get to sort the recipes accordingly.
 * @param {string} upDown We get 'up' or 'down' from the dataset of the buttons clicked.
 */
export const sortSearchResults = function (upDown) {
  if (upDown === 'up') {
    state.results.recipes.sort((a, b) => b.cooking_time - a.cooking_time);
    state.results.bookmarks.sort((a, b) => b.cooking_time - a.cooking_time);
  }
  if (upDown === 'down') {
    state.results.recipes.sort((a, b) => a.cooking_time - b.cooking_time);
    state.results.bookmarks.sort((a, b) => a.cooking_time - b.cooking_time);
  }

  loadPagination();
};
/**
 * We call this function in the controller and we use it to set up the pagination and get the data to render the results accordingly.
 * Here we set the recipeCount so we can access this when we render the pagination in the resultsView.
 * Here we set the paginationRecipies to the sliced recipies array so we get the right amount and the right recipes displayed.
 * @param {number} page
 */
export const loadPagination = function (page = state.results.page) {
  state.results.page = page;
  state.results.recipeCount = state.results.recipes.length;
  state.results.recipeCountBookmarks = state.results.bookmarks.length;
  if (state.results.isBookmarkList) {
    if (state.results.recipeCountBookmarks <= 10) {
      state.results.page = 1;
      console.log(state.results.page);
    }
  } else {
    if (state.results.recipeCount <= 10) {
      state.results.page = 1;
    }
  }
  const start = (state.results.page - 1) * state.results.resultsPerPage;
  const end = state.results.page * state.results.resultsPerPage;
  state.results.paginationRecipes = state.results.recipes.slice(start, end);
  state.results.paginationRecipesBookmarks = state.results.bookmarks.slice(
    start,
    end
  );
  console.log(state.results.paginationRecipesBookmarks);
};

/**
 * We use this function to check if we are on the bookmarks list page we can put the page back to 1 and render the bookmark list when needed over the result list
 * @param {string} isList a string that is either 'true' or 'false'
 */
export const updateIsBookmarkList = function (isList) {
  if (isList === 'true') {
    state.results.isBookmarkList = true;
    state.results.page = 1;
  } else {
    state.results.isBookmarkList = false;
  }
};

/**
 * With this function we update the serving and the quantity in the recipe by getting a string we get by looking at the dataset of the button and calling this function with it
 * @param {string} upDown string that says either 'up' or 'down'
 */
export const updateServings = function (upDown) {
  const oldServings = state.recipe.servings;

  if (upDown === 'up') {
    state.recipe.servings = state.recipe.servings + 1;
  }
  if (upDown === 'down') {
    if (oldServings === 1) return;
    state.recipe.servings = state.recipe.servings - 1;
  }

  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * state.recipe.servings) / oldServings)
  );
};
/**
 *We use this function to update the bookmarks array when we click the bookmark button in the recipe
 * @param {string} updateTo string that says either 'true' or 'false'
 */
export const updateBookmark = function (updateTo) {
  if (updateTo === 'true') {
    state.recipe.bookmarked = true;
    if (state.results.bookmarks.some(rec => rec.id === state.recipe.id)) {
      return;
    }
    state.results.bookmarks.push(state.recipe);
    return;
  }
  if (updateTo === 'false') {
    const index = state.results.bookmarks.findIndex(
      book => book.id === state.recipe.id
    );
    console.log(index);

    if (index !== -1) {
      state.results.bookmarks.splice(index, 1);
    }
    state.recipe.bookmarked = false;
    return;
  }
};

/**
 * We use this function to update either the paginationRecipe or the paginationRecipesBookmarks array depending if we are in the bookmarks list or the result list
 * @param {string} updateTo string that says either 'true' or 'false'
 * @param {number} index number of the index in an array we get from the dataset
 */
export const updateBookmarkResults = function (updateTo, index) {
  const recipes = state.results.isBookmarkList
    ? state.results.paginationRecipesBookmarks
    : state.results.paginationRecipes;
  recipes.forEach((recipe, i) => {
    if (updateTo === 'true') {
      if (index === i) {
        recipe.bookmarked = true;
        if (state.results.bookmarks.some(rec => rec.id === recipe.id)) {
          return;
        }

        state.results.bookmarks.push(recipe);
      }
    }
    if (updateTo === 'false') {
      if (index === i) {
        recipe.bookmarked = false;
        const index2 = state.results.bookmarks.findIndex(
          book => book.id === recipe.id
        );
        if (index2 !== -1) {
          state.results.bookmarks.splice(index2, 1);

          state.results.isBookmarkList
            ? recipes.splice(index - (state.results.page - 1) * 10, 1)
            : null;
        }
      }
    }
  });
  if (state.results.isBookmarkList) {
    state.results.paginationRecipesBookmarks = recipes;
  } else {
    state.results.paginationRecipes = recipes;
  }
  loadPagination();
};
/**
 * We use this function to add the new list of elements to the shoplistIngredients array
 * @param {Array} liArr Array of list ingredient elements for the shoplist
 */
export const updateShopList = function (liArr) {
  const arr1 = liArr;
  const arr2 = state.results.shoplistIngredients;
  state.results.shoplistIngredients = [...arr2, ...arr1];
};

/**
 * We clear the shoplistIngredients array
 */
export const removeShopList = function () {
  state.results.shoplistIngredients = [];
};
