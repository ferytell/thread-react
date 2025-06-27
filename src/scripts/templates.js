import { showFormattedDate } from './utils';

export function generateErrorTemplate() {
  return `
    <div id="error-template" class="error-template">
      <h2>Some Error Happen</h2>
      <p>Saat ini, tidak ada yang dapat ditampilkan.</p>
    </div>
  `;
}
export function generateStoriesListEmptyTemplate() {
  return `
    <div class="stories-empty">
      <i class="fas fa-book-open"></i>
      <h3>No Stories Found</h3>
      <p>Be the first to share your story!</p>
    </div>
  `;
}
export function generateSaveButtonTemplate() {
  return `
    <button id="save-button" class="btn save-button">
      SAVe <i class="fas fa-bell"></i>
    </button>
  `;
}
export function generateRemoveButtonTemplate() {
  return `
    <button id="remove-button" class="btn remove-button">
      REMove <i class="fas fa-bell"></i>
    </button>
  `;
}
export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `;
}
export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `;
}
export function generateSaveReportButtonTemplate() {
  return `
    <button id="report-detail-save" class="btn btn-transparent">
      Simpan laporan <i class="far fa-bookmark"></i>
    </button>
  `;
}
export function generateRemoveReportButtonTemplate() {
  return `
    <button id="report-detail-remove" class="btn btn-transparent">
      Buang laporan <i class="fas fa-bookmark"></i>
    </button>
  `;
}
export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}
export function generateLoadMoreButton(hasMore) {
  return `
    <div class="load-more-container">
      <button id="load-more-btn" class="btn-load-more" ${!hasMore ? 'disabled' : ''}>
        ${hasMore ? 'Load More Stories' : 'All Stories Loaded'}
        ${hasMore ? '<i class="fas fa-arrow-down"></i>' : '<i class="fas fa-check"></i>'}
      </button>
    </div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}
export function generateMainNavigationListTemplate() {
  return `
    <li><a id="new-story-button" class="btn new-story-button" href="#/add">Share Story <i class="fas fa-plus"></i></a></li>
    <li><a id="bookmarks-page-button" class="btn" href="#/bookmarks">Bookmarks <i class="fas fa-bookmark"></i></a></li>
    <li><button id="toggle-notification-btn" class="btn toggle-notification-btn">🔕</button></li>
    <li><button id="theme-toggle" class="btn theme-toggle-btn" aria-label="Toggle Theme">☼</button></li>


  `;
}
export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
    <li><a id="guest-story-button" class="btn guest-story-button" href="#/add-guest">Share as Guest</a></li>
  `;
}
export function generateAuthenticatedNavigationListTemplate() {
  return `
    
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}
export function generateStoriesListErrorTemplate(message) {
  return `
    <div class="stories-error">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Error Loading Stories</h3>
      <p>${message || 'Please try again later'}</p>
      <button id="retry-button" class="btn-retry">
        <i class="fas fa-sync-alt"></i> Try Again
      </button>
    </div>
  `;
}
export function generateStoryDetailErrorTemplate(message) {
  return `
    <div id="story-detail-error" class="story-detail__error">
      <h2>Error loading story details</h2>
      <p>${message ? message : 'Please try again later or use a different network.'}</p>
    </div>
  `;
}
export function generateStoryItemTemplate({
  id,
  description,
  photoUrl,
  photoBlob,
  name,
  createdAt,
  lat,
  lon,
  isBookmarked = false
}) {
  const hasLocation = lat && lon;

  const imageSrc = photoBlob ? URL.createObjectURL(photoBlob) : photoUrl;

  return `
    <div tabindex="0" class="story-item" data-storyid="${id}">
      <div class="story-item__header">
        <button class="story-item__bookmark" data-story-id="${id}" aria-label="${isBookmarked ? 'Remove bookmark' : 'Bookmark this story'}">
          <i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>
      </div>
      <img class="story-item__image" src="${imageSrc}" alt="Image with caption ${description.substring(0, 50)}...">
      <div class="story-item__body">
        <div class="story-item__main">
          <div class="story-item__description">
            ${description.substring(0, 150)}${description.length > 150 ? '...' : ''}
          </div>
          <div class="story-item__more-info">
            <div class="story-item__createdat">
              <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt)}
            </div>
            ${
              hasLocation
                ? `
            <div class="story-item__location">
              <i class="fas fa-map-marker-alt"></i> ${lat.toFixed(4)}, ${lon.toFixed(4)}
            </div>`
                : ''
            }
          </div>
        </div>
        <div class="story-item__more-info">
          <div class="story-item__author">
            Shared by: ${name || 'Guest'}
          </div>
        </div>
        <a class="btn story-item__read-more" href="#/stories/${id}">
          Read more <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}
export function generateStoryDetailImageTemplate(imageUrl = null, alt = '', id = '') {
  if (!imageUrl) {
    return `
      <img id="story-img-${id}" class="story-detail__image" src="images/placeholder-image.jpg" alt="Story image">
    `;
  }

  return `
    <img id="story-img-${id}" class="story-detail__image" src="${imageUrl}" alt="Image with caption ${alt}">
  `;
}

export function generateStoryDetailTemplate({
  description,
  photoUrl,
  photoBlob,
  name,
  createdAt,
  lat,
  lon,
  id
}) {
  const createdAtFormatted = showFormattedDate(createdAt);
  const hasLocation = lat && lon;
  const imageSrc = photoBlob ? URL.createObjectURL(photoBlob) : photoUrl;

  return `
    <div class="story-detail__header">
      <div class="container">
        <div class="story-detail__image-container">
           ${generateStoryDetailImageTemplate(imageSrc, description.substring(0, 50), id)}
        </div>
        <div class="story-conent">${description}</div>
      </div>

      <div class="story-detail__author-info">
        <div class="story-detail__author">Shared by: ${name || 'Guest'}</div>
        <div class="story-detail__createdat">
          <i class="fas fa-calendar-alt"></i> ${createdAtFormatted}
        </div>
      </div>

      ${
        hasLocation
          ? `
        <div class="story-detail__location">
          <button id="show-location-btn" class="btn-location" data-lat="${lat}" data-lon="${lon}">
            <i class="fas fa-map-marker-alt"></i> Show Location
          </button>
        </div>
      `
          : ''
      }
    </div>

    <div class="container">
      <div id="story-map-container" class="story-map-container" style="display:none">
        <div id="story-map" class="story-map"></div>
        <div id="map-loading"></div>
      </div>
    </div>
  `;
}

export function generateAddStoryFormTemplate(isGuest = false) {
  return `
    <div class="add-story-form">
      <h1>${isGuest ? 'Share Your Story as Guest' : 'Share Your Story'}</h1>
      
      <form id="story-form">
        <div class="form-group">
          <label for="description">Your Story</label>
          <textarea id="description" required placeholder="Tell your story..."></textarea>
        </div>
        
        <div class="form-group">
          <label for="photo">Photo</label>
          <input type="file" id="photo" accept="image/*" capture="environment" required>
          <div id="photo-preview-container" class="photo-preview"></div>
          <button type="button" id="capture-btn" class="btn btn-secondary">
            <i class="fas fa-camera"></i> Take Photo
          </button>
        </div>
        
        <div class="form-group">
          <label>
            <input type="checkbox" id="add-location"> Include Location
          </label>
          <div id="location-fields" class="location-fields" style="display: none;">
            <div id="map-container" class="map-container">
              <div id="location-map" class="location-map"></div>
            </div>
            <button type="button" id="get-current-location" class="btn btn-secondary">
              <i class="fas fa-location-arrow"></i> Use Current Location
            </button>
            <div class="coordinates">
              <div class="coordinate-field">
                <label for="lat">Latitude</label>
                <input type="number" id="lat" step="any" readonly>
              </div>
              <div class="coordinate-field">
                <label for="lon">Longitude</label>
                <input type="number" id="lon" step="any" readonly>
              </div>
            </div>
          </div>
        </div>
        
        <button type="submit" class="btn btn-primary">
          <i class="fas fa-share"></i> Share Story
        </button>
      </form>
    </div>
  `;
}
export function generateLoginFormTemplate() {
  return `
    <div class="auth-form">
      <h1>Login</h1>
      <form id="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" required minlength="8">
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <p>Don't have an account? <a href="#/register">Register here</a></p>
    </div>
  `;
}
export function generateRegisterFormTemplate() {
  return `
    <div class="auth-form">
      <h1>Register</h1>
      <form id="register-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" required minlength="8">
        </div>
        <button type="submit" class="btn btn-primary">Register</button>
      </form>
      <p>Already have an account? <a href="#/login">Login here</a></p>
    </div>
  `;
}
