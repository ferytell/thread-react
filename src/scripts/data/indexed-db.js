import { openDB, deleteDB } from 'idb';
import { fetchImageAsBlob } from './api';

const DB_NAME = 'story-app-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export const StoryDB = {
  async putStories(stories) {
    const db = await dbPromise;

    // 1. Ambil semua blob dulu
    const storiesWithBlobs = await Promise.all(
      stories.map(async (story) => {
        const imageBlob = await fetchImageAsBlob(story.photoUrl);
        return {
          ...story,
          photoBlob: imageBlob || null,
        };
      }),
    );

    // 2. Setelah semua blob siap, buka transaksi dan lakukan put
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.store;

    for (const story of storiesWithBlobs) {
      store.put(story); // Tanpa await!
    }

    return tx.done;
  },

  async getAllStories() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  async clearStories() {
    const db = await dbPromise;
    return db.clear(STORE_NAME);
  },
};
