import { ACCESS_TOKEN_KEY } from '../config';
import * as StoryAPI from '../data/api';

export default class HomeModel {
  constructor() {
    this.api = StoryAPI;
  }

  async getStories(page = 1, size = 10, withLocation = false) {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    try {
      const response = await this.api.getStories(page, size, withLocation, token);
      console.log('heheheheh', response);
      return response;
    } catch (error) {
      throw new Error(`Failed to grt a story: ${error.message}`);
    }
  }
}
