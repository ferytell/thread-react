import { openDB, deleteDB } from 'idb';
import { fetchImageAsBlob } from './api';
import { DB_CONFIG } from './db-config';

// const DB_NAME = 'story-app-db';
// const DB_VERSION = 1;
// const STORE_NAME = 'stories';

const dbPromise = openDB(DB_CONFIG.NAME, DB_CONFIG.VERSION, {
  upgrade(db, oldVersion) {
    if (!db.objectStoreNames.contains(DB_CONFIG.STORES.STORIES)) {
      db.createObjectStore(DB_CONFIG.STORES.STORIES, { keyPath: 'id' });
    }

    if (!db.objectStoreNames.contains(DB_CONFIG.STORES.BOOKMARKS)) {
      db.createObjectStore(DB_CONFIG.STORES.BOOKMARKS, { keyPath: 'storyId' });
    }
  },
});

export const StoryDB = {
  async putStories(stories) {
    const db = await dbPromise;
    console.log('stories inside story DB', stories);
    const storiesWithBlobs = await Promise.all(
      stories.map(async (story) => {
        const imageBlob = await fetchImageAsBlob(story.photoUrl);
        const lat = story.lat != null ? parseFloat(story.lat) : null;
        const lon = story.lon != null ? parseFloat(story.lon) : null;

        return {
          ...story,
          lat,
          lon,
          photoBlob: imageBlob || null,
        };
      }),
    );
    const tx = db.transaction(DB_CONFIG.STORES.STORIES, 'readwrite');
    const store = tx.store;

    for (const story of storiesWithBlobs) {
      store.put(story);
    }

    return tx.done;
  },

  async getAllStories() {
    const db = await dbPromise;
    return db.getAll(DB_CONFIG.STORES.STORIES);
  },

  async getStoryById(id) {
    const db = await dbPromise;
    return db.get(DB_CONFIG.STORES.STORIES, id);
  },

  async clearStories() {
    const db = await dbPromise;
    return db.clear(DB_CONFIG.STORES.STORIES);
  },
};
