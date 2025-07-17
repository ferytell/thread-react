import * as StoryAPI from '../data/api';
import { IndexedDB } from '../data/indexed-db';

export default class StoryDetailModel {
  
  async getStoryById(id) {
    try {
      const response = await StoryAPI.getStoryDetail(id);
      if (response.error) throw new Error(response.message);
      return response.story;
    } catch (error) {
      console.warn('Fetch from API failed. Falling back to IndexedDB.');
      return this.#getFromIndexedDB(id);
    }
  }

  async #getFromIndexedDB(id) {
    const allStories = await IndexedDB.getAllStories();
    const story = allStories.find((s) => s.id === id);
    if (!story) throw new Error('Data tidak ditemukan secara offline');
    return story;
  }
}
