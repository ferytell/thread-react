import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateBookmarkListEmptyTemplate
} from '../../templates';
import BookmarksPresenter from './bookmarks-presenter';

export default class BookmarksPage {
  constructor() {
    this.presenter = new BookmarksPresenter(this);
    this.container = null;
  }

  async render() {
    return `
      <section class="section-title">
        <h2>Bookmarks</h2>
      </section>

      <section class="container">
        <div class="stories-list__container">
          <div class="stories-list" id="bookmarks-list"></div>
          <div id="bookmarks-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.container = document.getElementById('bookmarks-list');
    await this.presenter.loadBookmarks();

    this.container.addEventListener('click', async (e) => {
      const bookmarkButton = e.target.closest('.story-item__bookmark');
      if (bookmarkButton) {
        const storyId = bookmarkButton.dataset.storyId;
        await this.presenter.handleBookmarkToggle(storyId);
      }
    });
  }

  showLoading() {
    this.container.innerHTML = generateLoaderAbsoluteTemplate();
  }

  // showEmptyState() {
  //   this.container.innerHTML = `
  //     <div class="empty-state">
  //       <i class="far fa-bookmark fa-3x"></i>
  //       <p>You haven't bookmarked any stories yet</p>
  //     </div>
  //   `;
  // }

  showEmptyState() {
    this.container.innerHTML = generateBookmarkListEmptyTemplate();
  }

  showBookmarks(bookmarks) {
    this.container.innerHTML = bookmarks
      .map((bookmark) =>
        generateStoryItemTemplate({
          ...bookmark.storyData,
          isBookmarked: true
        })
      )
      .join('');
  }

  showError() {
    this.container.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load bookmarks</p>
      </div>
    `;
  }

  removeBookmarkFromUI(storyId) {
    const storyElement = document.querySelector(`.story-item[data-storyid="${storyId}"]`);
    if (storyElement) storyElement.remove();
  }

  isListEmpty() {
    return this.container.children.length === 0;
  }
}
