import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
  generateLoadMoreButton,
} from '../../templates';
import HomePresenter from './home-presenter';

export default class HomePage {
  #stories = null;
  #currentPage = 1;
  #hasMore = true;
  #allStories = [];

  async render() {
    return `
      <section class="section-title">
        <h1>Welcome to Story Share</h1>
        <p>Discover and share stories from people around the world</p>
      </section>

      <section class="container">
        <h2 class="section-title">Recent Stories</h2>

        <div class="stories-list__container">
          <div class="stories-list" id="stories-list"></div>
          <div id="load-more-container"></div>
          <div id="stories-list-loading-container"></div>
        </div>
       
      </section>
    `;
  }

  async afterRender() {
    this.#stories = new HomePresenter({
      view: this,
    });

    await this.#loadStories();
    this.#setupLoadMore();
    //this.#deleteCache();
  }

  async #loadStories() {
    if (!this.#hasMore) return;

    this.showLoading();
    try {
      const response = await this.#stories.loadStories(this.#currentPage);
      this.#hasMore = response.hasMore;
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

  // #deleteCache() {
  //   document.getElementById('clear-stories-btn').addEventListener('click', async () => {
  //     await StoryDB.clearStories();
  //     alert('Cached stories cleared!');
  //   });
  // }

  handleViewStory(story) {
    window.location.hash = `#/stories/${story.id}`;
  }

  handleStoriesLoaded(stories) {
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
      .map((story) => generateStoryItemTemplate(story))
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
