
import StoryDetailModel from '../../models/story-detail-model';

export default class StoryDetailPresenter {
  constructor(storyId, { view }) {
    this.storyId = storyId;
    this.view = view;
    this.model = new StoryDetailModel();
  }

  async init() {
    try {
      this.view.showLoading();
      const story = await this.model.getStoryById(this.storyId);
      this.view.displayStory(story);
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.hideLoading();
    }
  }
}
