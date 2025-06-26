import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
  generateLoadMoreButton,
} from '../../templates';
import { BookmarkDB } from '../../data/bookmark-db';
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
    this.#setupBookmarkHandlers();
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

  #setupBookmarkHandlers() {
    document.getElementById('stories-list').addEventListener('click', async (e) => {
      if (e.target.closest('.story-item__bookmark')) {
        const button = e.target.closest('.story-item__bookmark');
        const storyId = button.dataset.storyId;
        const story = this.#allStories.find((s) => s.id === storyId);

        if (story) {
          const isNowBookmarked = await BookmarkDB.toggleBookmark(story);

          // Update the button appearance
          const icon = button.querySelector('i');
          if (isNowBookmarked) {
            icon.classList.replace('far', 'fas');
            button.setAttribute('aria-label', 'Remove bookmark');
          } else {
            icon.classList.replace('fas', 'far');
            button.setAttribute('aria-label', 'Bookmark this story');
          }
        }
      }
    });
  }

  handleViewStory(story) {
    window.location.hash = `#/stories/${story.id}`;
  }

  handleStoriesLoaded(stories) {
    console.log('Stories loaded:', stories.length);
  }

  async populateStoriesList(stories) {
    const storiesListElement = document.getElementById('stories-list');

    if (stories.length === 0) {
      this.populateStoriesListEmpty();
      return;
    }

    // Check bookmark status for each story
    const storiesWithBookmarks = await Promise.all(
      stories.map(async (story) => {
        const isBookmarked = await BookmarkDB.isBookmarked(story.id);
        return { ...story, isBookmarked };
      }),
    );

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
