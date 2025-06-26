// import { openDB } from 'idb';
// import { DB_CONFIG } from './db-config';
// import { fetchImageAsBlob } from './api';

// export const StoryDB = {
//   async putStories(stories) {
//     const db = await dbPromise;
//     console.log('stories inside story DB', stories);
//     const storiesWithBlobs = await Promise.all(
//       stories.map(async (story) => {
//         const imageBlob = await fetchImageAsBlob(story.photoUrl);
//         const lat = story.lat != null ? parseFloat(story.lat) : null;
//         const lon = story.lon != null ? parseFloat(story.lon) : null;

//         return {
//           ...story,
//           lat,
//           lon,
//           photoBlob: imageBlob || null,
//         };
//       }),
//     );
//     const tx = db.transaction(DB_CONFIG.STORES.STORIES, 'readwrite');
//     const store = tx.store;

//     for (const story of storiesWithBlobs) {
//       store.put(story);
//     }

//     return tx.done;
//   },

//   //   export const StoryDB = {
//   //   async getAllStories() {
//   //     try {
//   //       const db = await dbPromise;
//   //       return db.getAll(DB_CONFIG.STORES.STORIES);
//   //     } catch (error) {
//   //       console.error('StoryDB.getAllStories failed:', error);
//   //       throw error;
//   //     }
//   //   },
//   //   // ... other methods ...
//   // };

//   async getAllStories() {
//     try {
//       const db = await dbPromise;
//       return db.getAll(DB_CONFIG.STORES.STORIES);
//     } catch (error) {
//       console.error('StoryDB.getAllStories failed:', error);
//       throw error;
//     }
//   },

//   async getStoryById(id) {
//     const db = await dbPromise;
//     return db.get(DB_CONFIG.STORES.STORIES, id);
//   },

//   async clearStories() {
//     const db = await dbPromise;
//     return db.clear(DB_CONFIG.STORES.STORIES);
//   },
// };
