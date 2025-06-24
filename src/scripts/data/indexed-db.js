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
    console.log('stories inside story DB', stories);
    const storiesWithBlobs = await Promise.all(
      stories.map(async (story) => {
        const imageBlob = await fetchImageAsBlob(story.photoUrl);
        const lat = story.lat != null ? parseFloat(story.lat) : null;
        const lon = story.lon != null ? parseFloat(story.lon) : null;
        console.log('Saving story with:', {
          id: story.id,
          lat,
          lon,
        });

        return {
          ...story,
          lat,
          lon,
          photoBlob: imageBlob || null,
        };
      }),
    );
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.store;

    for (const story of storiesWithBlobs) {
      store.put(story);
    }

    return tx.done;
  },

  async getAllStories() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  async getStoryById(id) {
    const db = await dbPromise;
    return db.get(STORE_NAME, id);
  },

  async clearStories() {
    const db = await dbPromise;
    return db.clear(STORE_NAME);
  },
};
