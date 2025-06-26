import { openDB, deleteDB } from 'idb';
import { fetchImageAsBlob } from './api';
import { DB_CONFIG } from './db-config';

const DB_NAME = 'story-app-db';
const DB_VERSION = 1; // Single version for everything
const STORES = {
  STORIES: 'stories',
  BOOKMARKS: 'bookmarks',
};

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORES.STORIES)) {
      db.createObjectStore(STORES.STORES, { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains(STORES.BOOKMARKS)) {
      db.createObjectStore(STORES.BOOKMARKS, { keyPath: 'storyId' });
    }
  },
});

export const IndexedDB = {
  // ===== STORY OPERATIONS =====
  async putStories(stories) {
    const db = await dbPromise;
    const storiesWithBlobs = await Promise.all(
      stories.map(async (story) => {
        const imageBlob = await fetchImageAsBlob(story.photoUrl);
        return {
          ...story,
          lat: story.lat ? parseFloat(story.lat) : null,
          lon: story.lon ? parseFloat(story.lon) : null,
          photoBlob: imageBlob || null,
        };
      }),
    );

    const tx = db.transaction(STORES.STORES, 'readwrite');
    for (const story of storiesWithBlobs) {
      tx.store.put(story);
    }
    await tx.done;
  },

  async getAllStories() {
    const db = await dbPromise;
    return db.getAll(STORES.STORES);
  },

  async getStoryById(id) {
    const db = await dbPromise;
    return db.get(STORES.STORES, id);
  },

  async clearStories() {
    const db = await dbPromise;
    return db.clear(STORES.STORES);
  },

  // ===== BOOKMARK OPERATIONS =====
  async toggleBookmark(story) {
    const db = await dbPromise;
    const tx = db.transaction(STORES.BOOKMARKS, 'readwrite');
    const store = tx.store;

    const existing = await store.get(story.id);

    if (existing) {
      await store.delete(story.id);
      return false; // Bookmark removed
    } else {
      await store.put({
        storyId: story.id,
        storyData: story,
        createdAt: new Date().toISOString(),
      });
      return true; // Bookmark added
    }
  },

  async getBookmarkedStories() {
    const db = await dbPromise;
    return db.getAll(STORES.BOOKMARKS);
  },

  async isBookmarked(storyId) {
    const db = await dbPromise;
    return !!(await db.get(STORES.BOOKMARKS, storyId));
  },

  async removeBookmark(storyId) {
    const db = await dbPromise;
    return db.delete(STORES.BOOKMARKS, storyId);
  },

  // ===== MAINTENANCE =====
  async clearDatabase() {
    await deleteDB(DB_NAME);
    window.location.reload(); // Refresh to reinitialize
  },

  async checkDatabaseHealth() {
    try {
      const db = await dbPromise;
      return {
        ok: true,
        stores: Array.from(db.objectStoreNames),
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  },
};
