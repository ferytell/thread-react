import BookmarksModel from '../../models/bookmarks-model';

export default class BookmarksPresenter {
  constructor(view) {
    this.view = view;
    this.model = new BookmarksModel();
  }

  async loadBookmarks() {
    this.view.showLoading();

    try {
      const bookmarks = await this.model.getBookmarkedStories();

      if (bookmarks.length === 0) {
        this.view.showEmptyState();
      } else {
        this.view.showBookmarks(bookmarks);
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      this.view.showError();
    }
  }

  async handleBookmarkToggle(storyId) {
    try {
      await this.model.removeBookmark(storyId);
      this.view.removeBookmarkFromUI(storyId);

      if (this.view.isListEmpty()) {
        this.view.showEmptyState();
      }
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      alert('Failed to remove bookmark');
    }
  }
}
