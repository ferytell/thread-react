import HomeModel from '../../models/home-model';
import { IndexedDB } from '../../data/indexed-db';

export default class HomePresenter {
  constructor({ view }) {
    this.view = view;
    this.model = new HomeModel();
    //this.notificationService = new NotificationService(apiClient);
  }

  async loadStories(page) {
    try {
      const response = await this.model.getStories(page);
      if (response.error) {
        this.view.populateStoriesListError(response.message);

        const cachedStories = await IndexedDB.getAllStories();
        this.view.populateStoriesList(cachedStories);
        return {
          listStory: cachedStories,
          hasMore: false,
        };
      }

      const stories = response.listStory || [];
      if (page === 1) {
        await IndexedDB.clearStories(); // hapus yang lama
      }
      await IndexedDB.putStories(stories); // simpan yang baru

      return {
        listStory: stories,
        hasMore: stories.length >= 10, // 10 items per page
      };
    } catch (error) {
      console.error('Error loading stories:', error);
      console.log('IndexedDB.getAllStories called');
      const cachedStories = await IndexedDB.getAllStories();
      this.view.populateStoriesList(cachedStories);

      return {
        listStory: cachedStories,
        hasMore: false,
      };
    }
  }
}
