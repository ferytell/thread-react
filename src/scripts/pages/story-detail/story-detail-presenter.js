export default class StoryDetailPresenter {
  // #storyId;
  // #view;
  // #model;
  // #mapService;

  constructor(storyId, { view, model }) {
    this.storyId = storyId;
    this.view = view;
    this.model = model;
  }

  async init() {
    try {
      this.view.showLoading();

      //const id = window.location.hash.split('-').pop();
      const path = window.location.hash.split('/');
      const id = path[path.length - 1];

      console.log('ID=>>>', id);

      const response = await this.model.getStoryDetail(id);

      if (response.error) throw new Error(response.message);

      this.view.displayStory(response.story);
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.hideLoading();
    }
  }

  async postComment(commentData) {
    try {
      this.view.showCommentLoading();
      const response = await this.model.postComment(this.storyId, commentData);

      if (response.error) throw new Error(response.message);

      this.view.addNewComment(response.data);
      this.view.clearCommentForm();
    } catch (error) {
      this.view.showCommentError(error.message);
    } finally {
      this.view.hideCommentLoading();
    }
  }

  async toggleSaveStory() {
    try {
      const response = await this.model.toggleSaveStory(this.storyId);
      if (response.error) throw new Error(response.message);
      this.view.updateSaveButton(!response.data.isSaved);
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
