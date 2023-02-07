import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import bookmarksView from './views/bookmarksView';
import paginationView from './views/paginationView';
import addRecipeView from './views/addRecipeView';

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);

    // loading recipe
    await model.loadRecipe(id);

    // rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();

    // get search query
    const query = searchView.getQuery();
    if (!query) return;

    // load search results
    await model.loadSearchResults(query);

    // render results
    resultsView.render(model.getSearchResultPage());

    // render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    throw err;
  }
}

function controlPagination(page) {
  resultsView.render(model.getSearchResultPage(page));
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  // update the recipe servings
  model.updateServings(newServings);

  // update the recipe view
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  // add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

// eslint-disable-next-line no-unused-vars
async function controlAddRecipe(newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // close form window
    setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
}

function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddMarkbook(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
