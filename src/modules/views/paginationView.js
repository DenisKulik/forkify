import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _curPage;

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = Number(btn.dataset.pageto);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    this._curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    if (this._curPage === 1 && numPages > 1) {
      return this._generateButtonNext();
    }

    if (this._curPage === numPages && numPages > 1) {
      return this._generateButtonPrev();
    }

    if (this._curPage < numPages) {
      return `
				${this._generateButtonPrev()}
				${this._generateButtonNext()}
			`;
    }

    return '';
  }

  _generateButtonPrev() {
    return `
			<button class="btn--inline pagination__btn--prev" data-pageto="${
        this._curPage - 1
      }">
				<svg class="search__icon">
					<use href="${icons}#icon-arrow-left"></use>
				</svg>
				<span>Page ${this._curPage - 1}</span>
			</button>
		`;
  }

  _generateButtonNext() {
    return `
			<button class="btn--inline pagination__btn--next" data-pageto="${
        this._curPage + 1
      }">
				<span>Page ${this._curPage + 1}</span>
				<svg class="search__icon">
					<use href="${icons}#icon-arrow-right"></use>
				</svg>
			</button>
		`;
  }
}

export default new PaginationView();
