import { openDB, deleteDB } from 'idb';

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
    const tx = db.transaction(STORE_NAME, 'readwrite');
    for (const story of stories) {
      tx.store.put(story);
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
