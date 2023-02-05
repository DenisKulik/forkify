import { API_URL, RES_REP_PAGE } from './config';
import { getJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_REP_PAGE,
  },
  bookmarks: [],
};

export async function loadRecipe(id) {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    // eslint-disable-next-line no-return-assign, no-param-reassign
    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
}

export async function loadSearchResults(query) {
  // eslint-disable-next-line no-useless-catch
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
}

export function getSearchResultPage(page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach((ing) => {
    // eslint-disable-next-line no-param-reassign
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
}

export function addBookmark(recipe) {
  // add dookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  storeBookmarks();
}

export function removeBookmark(id) {
  // remove bookmark
  const idx = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(idx, 1);

  // Mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  storeBookmarks();
}

export function storeBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

function init() {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
}

init();
