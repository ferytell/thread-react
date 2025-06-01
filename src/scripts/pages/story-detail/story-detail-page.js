import {
  generateStoryDetailTemplate,
  generateLoaderTemplate,
  generateErrorTemplate,
  generateSaveButtonTemplate,
  generateRemoveButtonTemplate,
} from '../../templates';
import StoryDetailPresenter from './story-detail-presenter';
import * as StoryAPI from '../../data/api';
import MapService from '../../services/map-services';

export default class StoryDetailPage {
  #presenter;

  constructor() {
    this.presenter = null;
    this.mapService = null;
  }

  async render() {
    return `
      <section class="story-detail">
        <div id="story-content" class="story-content">
          <div id="story-loading"></div>
        </div>
        
        <div id="story-map-container" class="story-map-container" style="display:none">
          <div id="stories-list" class="stories-list"></div>
          <div id="map-loading"></div>
        </div>
      </section>
    `;
  }

  logState() {
    console.log('Page State:', {
      presenter: this.presenter,
      storyId: this.getStoryIdFromUrl(),
    });
  }

  async afterRender() {
    try {
      const storyId = this.getStoryIdFromUrl();
      this.presenter = new StoryDetailPresenter(storyId, {
        view: this,
        model: StoryAPI,
      });

      await this.presenter.init();
    } catch (error) {
      console.error('Failed to initialize story detail:', error);
      this.showError('Failed to load story. Please try again later.');
    }
  }

  displayStory(story) {
    const storyContent = document.getElementById('story-content');
    storyContent.innerHTML = generateStoryDetailTemplate({
      ...story,
      date: this.#formatDate(story.createdAt),
    });

    if (story.lat && story.lon) {
      //document.getElementById('story-map-container').style.display = 'block';
      this.#setupMapButton(story.lat, story.lon);
    }
  }

  updateSaveButton(isSaved) {
    const container =
      document.getElementById('save-button-container') || document.createElement('div');
    container.id = 'save-button-container';
    container.innerHTML = isSaved ? generateRemoveButtonTemplate() : generateSaveButtonTemplate();

    container
      .querySelector('button')
      .addEventListener('click', () => this.#presenter.toggleSaveStory());

    if (!document.getElementById('save-button-container')) {
      document.querySelector('.story-content').appendChild(container);
    }
  }

  showLoading() {
    document.getElementById('story-loading').innerHTML = generateLoaderTemplate();
  }

  hideLoading() {
    const loading = document.getElementById('story-loading');
    if (loading) {
      loading.innerHTML = '';
    }
  }

  showError(message) {
    document.getElementById('story-content').innerHTML = generateErrorTemplate(message);
  }

  getStoryIdFromUrl() {
    const path = window.location.hash.split('/');
    const id = path[path.length - 1];
    if (!id || id === '#') {
      throw new Error('Invalid story ID in URL');
    }
    return id;
  }
  #formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  #setupMapButton(lat, lon) {
    const showLocationBtn = document.getElementById('show-location-btn');
    if (!showLocationBtn) return;

    //showLocationBtn.addEventListener('click', async () => {
    const originalClickHandler = async () => {
      try {
        // loading
        document.getElementById('map-loading').innerHTML = generateLoaderTemplate();
        document.getElementById('story-map-container').style.display = 'block';

        if (!this.mapService) {
          this.mapService = new MapService('story-map');
          await this.mapService.init();
        }

        // Set map view and marker
        this.mapService
          .setView(lat, lon, 15)
          .setMarker(lat, lon)
          .addPopup('Story Location', `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);

        document.getElementById('map-loading').innerHTML = '';
        showLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Hide Location';

        showLocationBtn.onclick = () => {
          document.getElementById('story-map-container').style.display = 'none';
          showLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Show Location';
          showLocationBtn.onclick = originalClickHandler;
        };
      } catch (error) {
        console.error('Failed to load map:', error);
        document.getElementById('map-loading').innerHTML = 'Failed to load map';
      }
    };

    showLocationBtn.onclick = originalClickHandler;
  }
  #destroyMap() {
    if (this.mapService) {
      console.log('destroy mapp called');
      this.mapService.destroy();
      this.mapService = null;
    }
  }
  cleanup() {
    this.#destroyMap();
  }
}
