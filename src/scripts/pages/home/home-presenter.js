import HomeModel from '../../models/home-model';

export default class HomePresenter {
  constructor({ view }) {
    this.view = view;
    this.model = new HomeModel();
  }

  async loadStories(page) {
    try {
      const response = await this.model.getStories(page);
      console.log('response=>>>', response);

      if (response.error) {
        this.view.populateStoriesListError(response.message);
      }

      return {
        listStory: response.listStory || [],
        hasMore: response.listStory.length >= 10, // 10 items per page
      };
    } catch (error) {
      console.error('Error loading stories:', error);
      return {
        listStory: [],
        hasMore: false,
      };
    }
  }
}
