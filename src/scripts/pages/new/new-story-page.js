//import NewPresenter from './new-presenter';
import NewStoryPresenter from './new-story-presenter';
import { convertBase64ToBlob } from '../../utils';
import * as StoryAPI from '../../data/api';
import { generateLoaderAbsoluteTemplate } from '../../templates';
import Camera from '../../utils/camera';

export default class NewStoryPage {
  #presenter;
  #form;
  #camera;
  #isCameraOpen = false;
  #takenPhotos = [];

  async render() {
    return `
      <section>
        <div class="new-story__header">
          <div class="container">
            <h1 class="new-story__header__title">Share Your Story</h1>
            <p class="new-story__header__description">
              Tell your story with photos and location (optional).<br>
              Share your experiences with the community.
            </p>
          </div>
        </div>
      </section>
  
      <section class="container">
        <div class="new-form__container">
          <form id="story-form" class="new-form">
            <div class="form-control">
              <label for="description-input" class="new-form__description__title">Your Story</label>
  
              <div class="new-form__description__container">
                <textarea
                  id="description-input"
                  name="description"
                  required
                  placeholder="Share what's on your mind..."
                ></textarea>
              </div>
            </div>
            
            <div class="form-control">
              <label for="photos-input" class="new-form__photos__title">Photos</label>
              <div id="photos-more-info">Add photos to make your story more engaging</div>
  
              <div class="new-form__photos__container">
                <div class="new-form__photos__buttons">
                  <button id="photos-input-button" class="btn btn-outline" type="button">
                    Upload Photos
                  </button>
                  <input
                    id="photos-input"
                    name="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    hidden="hidden"
                    aria-describedby="photos-more-info"
                  >
                  <button id="open-photos-camera-button" class="btn btn-outline" type="button">
                    Open Camera
                  </button>
                </div>
                <div id="camera-container" class="new-form__camera__container">
                  <video id="camera-video" class="new-form__camera__video">
                    Video stream not available.
                  </video>
                  <canvas id="camera-canvas" class="new-form__camera__canvas"></canvas>
  
                  <div class="new-form__camera__tools">
                    <select id="camera-select"></select>
                    <div class="new-form__camera__tools_buttons">
                      <button id="camera-take-button" class="btn" type="button">
                        Take Photo
                      </button>
                    </div>
                  </div>
                </div>
                <ul id="photos-taken-list" class="new-form__photos__outputs"></ul>
              </div>
            </div>
            
            <div class="form-control">
              <div class="new-form__location__title">Location (Optional)</div>
              <div class="new-form__location__toggle">
                <label>
                  <input type="checkbox" id="include-location"> Include Location
                </label>
              </div>
              
  
              <div id="location-fields" class="new-form__location__container" style="display: none;">
                <div class="new-form__location__map__container">
                  <div id="map" class="new-form__location__map"></div>
                  <div id="map-loading-container"></div>
                </div>
                <div class="new-form__location__lat-lng">
                  <input type="number" id="latitude" name="latitude" placeholder="Latitude" readonly>
                  <input type="number" id="longitude" name="longitude" placeholder="Longitude" readonly>
                </div>
                <button type="button" id="get-current-location" class="btn btn-outline">
                  Use Current Location
                </button>
              </div>
            </div>

            <div class="form-control">
              <div class="new-form__location__title">Post as Anon</div>
                <div class="new-form__location__toggle">
                <label>
                  <input type="checkbox" id="be-anon"> Be Anon
                </label>
              </div>
            </div>
            
            <div class="form-buttons">
              <span id="submit-button-container">
                <button class="btn" type="submit">Share Story</button>
              </span>
              <a class="btn btn-outline" href="#/">Cancel</a>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new NewStoryPresenter({
      view: this,
      model: StoryAPI,
    });
    this.#takenPhotos = [];
    this.#togglePhotoButtons();
    this.#setupLocationToggle();
    await this.#presenter.initMap();
    this.#setupForm();
  }

  #setupForm() {
    this.#form = document.getElementById('story-form');
    this.#form.addEventListener('submit', async (event) => {
      event.preventDefault();
      this.showSubmitLoadingButton();
      const formData = new FormData();
      formData.append('description', this.#form.elements.namedItem('description').value);

      // photos
      this.#takenPhotos.forEach((photo, index) => {
        formData.append('photo', photo.blob, `photo-${index}.jpg`);
      });
      // location if enabled
      if (document.getElementById('include-location').checked) {
        formData.append('lat', this.#form.elements.namedItem('latitude').value);
        formData.append('lon', this.#form.elements.namedItem('longitude').value);
      }
      // Guest Mode if enabled
      if (document.getElementById('be-anon').checked) {
        formData.append('is_anonymous', 'true');
      }

      await this.#presenter.postNewStory(formData);
    });

    // File upload handler
    document.getElementById('photos-input').addEventListener('change', async (event) => {
      const uploadPromises = Array.from(event.target.files).map(async (file) => {
        return await this.#addTakenPhoto(file);
      });
      await Promise.all(uploadPromises);
      await this.#populateTakenPhotos();
    });

    document.getElementById('photos-input-button').addEventListener('click', () => {
      document.getElementById('photos-input').click();
    });

    // Camera setup
    const cameraContainer = document.getElementById('camera-container');
    document
      .getElementById('open-photos-camera-button')
      .addEventListener('click', async (event) => {
        cameraContainer.classList.toggle('open');
        this.#isCameraOpen = cameraContainer.classList.contains('open');

        if (this.#isCameraOpen) {
          event.currentTarget.textContent = 'Close Camera';
          this.#setupCamera();
          await this.#camera.launch();
        } else {
          event.currentTarget.textContent = 'Open Camera';
          this.#camera.stop();
        }
      });
  }

  #setupLocationToggle() {
    const locationCheckbox = document.getElementById('include-location');
    const locationFields = document.getElementById('location-fields');

    locationCheckbox.addEventListener('change', () => {
      if (locationCheckbox.checked) {
        locationFields.style.display = 'block';
        this.#presenter.showMap();
      } else {
        locationFields.style.display = 'none';
      }
    });
    // locationCheckbox.addEventListener('change', async () => {
    //   if (locationCheckbox.checked) {
    //     locationFields.style.display = 'block';

    //     // Let the DOM apply display change first
    //     setTimeout(async () => {
    //       await this.#presenter.showMap();

    //       // After map is created, force re-render
    //       setTimeout(() => {
    //         if (this.#presenter.map && this.#presenter.map.invalidateSize) {
    //           this.#presenter.map.invalidateSize();
    //         }
    //       }, 200); // allow time for DOM layout
    //     }, 100); // delay for style update
    //   } else {
    //     locationFields.style.display = 'none';
    //   }
    // });
  }
  #setupCamera() {
    if (!this.#camera) {
      this.#camera = new Camera({
        video: document.getElementById('camera-video'),
        cameraSelect: document.getElementById('camera-select'),
        canvas: document.getElementById('camera-canvas'),
      });
    }

    this.#camera.addCheeseButtonListener('#camera-take-button', async () => {
      const image = await this.#camera.takePicture();
      await this.#addTakenPhoto(image);
      await this.#populateTakenPhotos();
      this.#closeCamera();
    });
  }
  async #addTakenPhoto(image) {
    let blob = image;

    if (typeof image === 'string') {
      blob = await convertBase64ToBlob(image, 'image/jpeg');
    }

    const newPhoto = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };
    this.#takenPhotos = [...this.#takenPhotos, newPhoto];
    this.#togglePhotoButtons();
  }
  async #populateTakenPhotos() {
    const html = this.#takenPhotos
      .map((photo, index) => {
        const imageUrl = URL.createObjectURL(photo.blob);
        return `
        <li class="new-form__photos__outputs-item">
          <button type="button" data-deletephotoid="${photo.id}" class="new-form__photos__outputs-item__delete-btn">
            <img src="${imageUrl}" alt="Photo ${index + 1}">
            <span class="delete-icon">&times;</span>
          </button>
        </li>
      `;
      })
      .join('');

    document.getElementById('photos-taken-list').innerHTML = html;

    document.querySelectorAll('button[data-deletephotoid]').forEach((button) => {
      button.addEventListener('click', (event) => {
        const photoId = event.currentTarget.dataset.deletephotoid;
        this.#removePhoto(photoId);
        this.#populateTakenPhotos();
      });
    });
  }
  #closeCamera() {
    const cameraContainer = document.getElementById('camera-container');
    const cameraButton = document.getElementById('open-photos-camera-button');

    // Stop the camera stream
    this.#camera.stop();

    // Update UI states
    cameraContainer.classList.remove('open');
    this.#isCameraOpen = false;
    cameraButton.textContent = 'Open Camera';
  }
  #removePhoto(id) {
    this.#takenPhotos = this.#takenPhotos.filter((photo) => photo.id !== id);
    this.#togglePhotoButtons();
  }
  #togglePhotoButtons() {
    const uploadButton = document.getElementById('photos-input-button');
    const cameraButton = document.getElementById('open-photos-camera-button');

    if (this.#takenPhotos.length > 0) {
      uploadButton.style.display = 'none';
      cameraButton.style.display = 'none';
    } else {
      uploadButton.style.display = 'inline-block';
      cameraButton.style.display = 'inline-block';
      //cameraContainer.style.display = 'inline-block';
    }
  }

  setLocation(lat, lng) {
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
  }
  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }
  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showSuccess(message) {
    alert(message);
    this.clearForm();
    window.location.hash = '#/';
  }
  showError(message) {
    alert(message);
    this.hideSubmitLoadingButton();
  }
  clearForm() {
    this.#form.reset();
    this.#takenPhotos = [];
    document.getElementById('photos-taken-list').innerHTML = '';
    document.getElementById('include-location').checked = false;
    document.getElementById('location-fields').style.display = 'none';
  }
  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner fa-spin"></i> Sharing...
      </button>
    `;
  }
  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Share Story</button>
    `;
  }
}
