import { StoryDB } from '../../data/indexed-db';

export default class StoryDetailPresenter {
  constructor(storyId, { view, model }) {
    this.storyId = storyId;
    this.view = view;
    this.model = model;
  }

  async init() {
    try {
      this.view.showLoading();
      const path = window.location.hash.split('/');
      const id = path[path.length - 1];
      const response = await this.model.getStoryDetail(id);
      console.log('response details', response);
      if (response.error) throw new Error(response.message);

      this.view.displayStory(response.story);
    } catch (error) {
      console.warn('Fetch failed, trying fallback to IndexedDB');
      const path = window.location.hash.split('/');
      const id = path[path.length - 1];

      try {
        const allStories = await StoryDB.getAllStories();
        const story = allStories.find((s) => s.id === id);

        if (story) {
          console.log('useing DB', story);
          this.view.displayStory(story);
        } else {
          throw new Error('Data tidak ditemukan secara offline');
        }
      } catch (dbError) {
        this.view.showError(dbError.message);
      }

      //this.view.showError(error.message);
    } finally {
      this.view.hideLoading();
    }
  }
}
