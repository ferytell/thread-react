import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
  generateLoadMoreButton,
} from '../../templates';
import HomeStories from './home-stories';
import * as StoryAPI from '../../data/api';

export default class HomePage {
  #stories = null;
  #currentPage = 1;
  #hasMore = true;
  #totalPages = 1;
  #allStories = [];

  async render() {
    return `
      <section class="section-title">
        <h1>Welcome to Story Share</h1>
        <p>Discover and share stories from people around the world</p>
      </section>

      <section class="container">
        <h1 class="section-title">Recent Stories</h1>
        
        <div class="stories-list__container">
          <div class="stories-list" id="stories-list"></div>
          <div id="load-more-container"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#stories = new HomeStories({
      view: this,
      model: StoryAPI,
    });

    //console.log("first init ");
    //await this.#stories.loadStories(this.#currentPage);
    await this.#loadStories();
    this.#setupLoadMore();
  }

  async #loadStories() {
    if (!this.#hasMore) return;

    this.showLoading();
    try {
      const response = await this.#stories.loadStories(this.#currentPage);
      this.#hasMore = response.hasMore;
      // await this.#stories.loadStories(this.#currentPage);

      this.#allStories = [...this.#allStories, ...response.listStory];
      this.populateStoriesList(this.#allStories);

      this.#renderLoadMoreButton();
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      this.hideLoading();
    }
  }

  #setupLoadMore() {
    document.addEventListener('click', async (e) => {
      if (e.target.id === 'load-more-btn' && this.#hasMore) {
        this.#currentPage++;
        await this.#loadStories();
      }
    });
  }

  #renderLoadMoreButton() {
    const container = document.getElementById('load-more-container');
    container.innerHTML = generateLoadMoreButton(this.#hasMore);
  }

  handleViewStory(story) {
    // Handle navigation to story detail
    window.location.hash = `#/stories/${story.id}`;
  }

  handleStoriesLoaded(stories) {
    // Optional: Do something with loaded stories
    console.log('Stories loaded:', stories.length);
  }

  populateStoriesList(stories) {
    console.log('populateStoriesList called');
    const storiesListElement = document.getElementById('stories-list');

    if (stories.length === 0) {
      this.populateStoriesListEmpty();
      return;
    }

    storiesListElement.innerHTML = stories
      .map(
        (story) => generateStoryItemTemplate(story),

        // generateStoryItemTemplate({
        //   id: story.id,
        //   description: story.description,
        //   photoUrl: story.photoUrl,
        //   name: story.name,
        //   createdAt: story.createdAt,
        //   lat: story.lat,
        //   lon: story.lon,
        // }),
      )
      .join('');
  }

  populateStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message);
  }

  updateMapWithStories(stories) {}

  showLoading() {
    document.getElementById('stories-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }
}
