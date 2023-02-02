import * as model from './model';
import recipeView from './views/recipeView';

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // loading recipe
    await model.loadRecipe(id);

    // rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert(err);
  }
}

['hashchange', 'load'].forEach((ev) => {
  window.addEventListener(ev, controlRecipes);
});
