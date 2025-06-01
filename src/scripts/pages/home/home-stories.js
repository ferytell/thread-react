// src/scripts/pages/home/home-stories.js
export default class HomeStories {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }

  async loadStories(page = 1) {
    try {
      //this.view.showLoading();
      //this.view.showMapLoading();

      // Fetch stories from API
      const response = await this.model.getStories(page);
      console.log('response=>>>', response);

      if (response.error) {
        this.view.populateStoriesListError(response.message);
      }
      //else {
      // this.view.currentPage = response.page;
      // this.view.totalPages = response.totalPages;
      // this.view.populateStoriesList(response.listStory);
      // this.view.updateMapWithStories(response.listStory);

      //}

      return {
        listStory: response.listStory || [],
        hasMore: response.listStory.length >= 10, // Assuming 10 items per page
      };
    } catch (error) {
      //this.view.populateStoriesListError(error.message);
      console.error('Error loading stories:', error);
      return {
        listStory: [],
        hasMore: false,
      };
    }
    //finally {
    //this.view.hideLoading();
    //this.view.hideMapLoading();
    //}
  }
}
