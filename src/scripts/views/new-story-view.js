export default class NewStoryView {
  constructor() {
    this.form = document.getElementById('story-form');
    this.cameraContainer = document.getElementById('camera-container');
    this.photosList = document.getElementById('photos-taken-list');
    this.locationFields = document.getElementById('location-fields');
    this.submitButtonContainer = document.getElementById('submit-button-container');
    this.mapLoadingContainer = document.getElementById('map-loading-container');
  }

  bindSubmitStory(handler) {
    this.form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(this.form);
      handler(formData);
    });
  }

  bindOpenCamera(handler) {
    document.getElementById('open-photos-camera-button').addEventListener('click', handler);
  }

  bindLocationToggle(handler) {
    document.getElementById('include-location').addEventListener('change', handler);
  }

  showMapLoading() {
    this.mapLoadingContainer.innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    this.mapLoadingContainer.innerHTML = '';
  }

  showSuccess(message) {
    alert(message);
    this.clearForm();
    window.location.hash = '#/';
  }

  showError(message) {
    alert(message);
  }

  clearForm() {
    this.form.reset();
    this.photosList.innerHTML = '';
    this.locationFields.style.display = 'none';
  }
}
