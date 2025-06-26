import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
  generateLoadMoreButton,
} from '../../templates';
import { BookmarkDB } from '../../data/bookmark-db';

export default class BookmarksPage {
  async render() {
    return `
      <section class="section-title">
        <h2>Bookmarks</h1>
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
    await this.#loadBookmarks();
    this.#setupBookmarkHandlers();
  }

  #setupBookmarkHandlers() {
    document.getElementById('bookmarks-list').addEventListener('click', async (e) => {
      const bookmarkButton = e.target.closest('.story-item__bookmark');

      if (bookmarkButton) {
        const storyId = bookmarkButton.dataset.storyId;
        await this.#handleBookmarkToggle(storyId);
      }
    });
  }

  async #handleBookmarkToggle(storyId) {
    try {
      // Remove from bookmarks
      await BookmarkDB.removeBookmark(storyId);

      // Remove from UI
      const storyElement = document.querySelector(`.story-item[data-storyid="${storyId}"]`);
      if (storyElement) {
        storyElement.remove();
      }

      // Check if list is now empty
      const container = document.getElementById('bookmarks-list');
      if (container.children.length === 0) {
        this.#showEmptyState();
      }
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      alert('Failed to remove bookmark');
    }
  }
  #showEmptyState() {
    const container = document.getElementById('bookmarks-list');
    container.innerHTML = `
      <div class="empty-state">
        <i class="far fa-bookmark fa-3x"></i>
        <p>You haven't bookmarked any stories yet</p>
      </div>
    `;
  }

  async #loadBookmarks() {
    const container = document.getElementById('bookmarks-list');
    container.innerHTML = generateLoaderAbsoluteTemplate();

    try {
      const bookmarks = await BookmarkDB.getBookmarkedStories();

      if (bookmarks.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="far fa-bookmark fa-3x"></i>
            <p>You haven't bookmarked any stories yet</p>
          </div>
        `;
      } else {
        container.innerHTML = bookmarks
          .map((bookmark) =>
            generateStoryItemTemplate({
              ...bookmark.storyData,
              isBookmarked: true,
            }),
          )
          .join('');
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      container.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load bookmarks</p>
        </div>
      `;
    }
  }
}
