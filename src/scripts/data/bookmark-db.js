import { openDB } from 'idb';
import { DB_CONFIG } from './db-config';

// const DB_NAME = 'story-app-db';
// const DB_VERSION = 2;
// const STORE_NAME = 'bookmarks';

const dbPromise = openDB(DB_CONFIG.NAME, DB_CONFIG.VERSION, {
  upgrade(db, oldVersion) {
    if (oldVersion < 2) {
      if (!db.objectStoreNames.contains(DB_CONFIG.STORES.BOOKMARKS)) {
        db.createObjectStore(DB_CONFIG.STORES.BOOKMARKS, { keyPath: 'storyId' });
      }
    }
  },
});

export const BookmarkDB = {
  // async toggleBookmark(story) {
  //   const db = await dbPromise;
  //   const tx = db.transaction(DB_CONFIG.STORES.BOOKMARKS, 'readwrite');
  //   const store = tx.objectStore(DB_CONFIG.STORES.BOOKMARKS);

  //   // Check if already bookmarked
  //   const existing = await store.get(story.id);

  //   if (existing) {
  //     await store.delete(story.id);
  //     return false; // Removed bookmark
  //   } else {
  //     await store.put({
  //       storyId: story.id,
  //       storyData: story,
  //       createdAt: new Date().toISOString(),
  //     });
  //     return true; // Added bookmark
  //   }
  // },

  async toggleBookmark(story) {
    const db = await dbPromise;
    const tx = db.transaction(DB_CONFIG.STORES.BOOKMARKS, 'readwrite');
    const store = tx.objectStore(DB_CONFIG.STORES.BOOKMARKS);

    // First verify the story still exists
    const storyExists = await await db
      .transaction(DB_CONFIG.STORES.STORIES)
      .objectStore(DB_CONFIG.STORES.STORIES)
      .get(story.id);

    if (!storyExists) {
      throw new Error('Story no longer exists');
    }

    const existing = await store.get(story.id);

    if (existing) {
      await store.delete(story.id);
      return false;
    } else {
      await store.put({
        storyId: story.id,
        storyData: story,
        createdAt: new Date().toISOString(),
      });
      return true;
    }
  },

  async getBookmarkedStories() {
    const db = await dbPromise;
    return db.getAll(DB_CONFIG.STORES.BOOKMARKS);
  },

  async isBookmarked(storyId) {
    const db = await dbPromise;
    return !!(await db.get(DB_CONFIG.STORES.BOOKMARKS, storyId));
  },

  async removeBookmark(storyId) {
    const db = await dbPromise;
    const tx = db.transaction(DB_CONFIG.STORES.BOOKMARKS, 'readwrite');
    await tx.objectStore(DB_CONFIG.STORES.BOOKMARKS).delete(storyId);
    await tx.done;
  },
};
