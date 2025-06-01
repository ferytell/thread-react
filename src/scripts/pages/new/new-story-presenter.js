import MapService from '../../services/map-services';

export default class NewStoryPresenter {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
    this.map = null;
    this.marker = null;
    this.mapService = new MapService('map');
  }

  async initMap() {
    await this.mapService.init();
    this.mapService.setClickHandler((lat, lng) => {
      this.view.setLocation(lat, lng);
      this.mapService.setMarker(lat, lng);
    });
  }

  showMap() {
    console.log('showMap map iscalled');
    this.mapService.setView(-6.35897532723566, 106.885986328125); // we set map default at jakarta hwhw
    this.mapService.setMarker(-6.35897532723566, 106.885986328125);
  }

  async getCurrentLocation() {
    try {
      console.log('start');
      this.view.showMapLoading();
      console.log('GO');
      const coords = await this.mapService.getCurrentPosition();
      console.log('gett', coords);
      this.view.setLocation(coords.latitude, coords.longitude);

      this.mapService
        .setView(coords.latitude, coords.longitude)
        .setMarker(coords.latitude, coords.longitude);
    } catch (error) {
      this.view.showError('Unable to retrieve your location: ' + error.message);
    } finally {
      this.view.hideMapLoading();
    }
  }

  async postNewStory(formData) {
    try {
      // Check if user is authenticated (you'll need to implement this)
      const token = localStorage.getItem('token'); // Or your auth method
      console.log('formData', formData);
      const response = await this.model.addStory(formData, token);

      if (response.error) {
        this.view.showError(response.message);
      } else {
        this.view.showSuccess('Story shared successfully!');
      }
    } catch (error) {
      this.view.showError('Failed to share story: ' + error.message);
    } finally {
      this.view.hideSubmitLoadingButton();
    }
  }
}
