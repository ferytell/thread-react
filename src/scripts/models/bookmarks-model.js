import { IndexedDB } from '../data/indexed-db';

export default class BookmarksModel {
  async getBookmarkedStories() {
    try {
      return await IndexedDB.getBookmarkedStories();
    } catch (error) {
      throw new Error(`Failed to get bookmarks: ${error.message}`);
    }
  }

  async removeBookmark(storyId) {
    try {
      await IndexedDB.removeBookmark(storyId);
    } catch (error) {
      throw new Error(`Failed to remove bookmark: ${error.message}`);
    }
  }
}
