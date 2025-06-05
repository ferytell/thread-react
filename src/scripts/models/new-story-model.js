import { ACCESS_TOKEN_KEY } from '../config';
import * as StoryAPI from '../data/api';

export default class NewStoryModel {
  constructor() {
    this.api = StoryAPI;
  }

  async addStorys(formData) {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    try {
      const response = await this.api.addStory(formData, token);
      return response;
    } catch (error) {
      throw new Error(`Failed to post story: ${error.message}`);
    }
  }
}
