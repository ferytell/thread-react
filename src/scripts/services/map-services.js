import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default class MapService {
  constructor(containerId, initialCoords = [-2.5489, 118.0149], initialZoom = 5) {
    this.containerId = containerId;
    this.initialCoords = initialCoords;
    this.initialZoom = initialZoom;
    this.map = null;
    this.marker = null;
  }

  init() {
    this.map = L.map(this.containerId).setView(this.initialCoords, this.initialZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 1000);

    return this; // For method chaining
  }

  setClickHandler(callback) {
    this.map.on('click', (e) => {
      callback(e.latlng.lat, e.latlng.lng);
    });

    return this;
  }

  invalidateSize() {
    if (this.map) {
      this.map.invalidateSize();
    }
    return this;
  }

  setMarker(lat, lng) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: 'images/leaf-orange.png',
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        shadowUrl: 'images/leaf-shadow.png',
        shadowSize: [50, 64],
        shadowAnchor: [4, 62],
        popupAnchor: [-2, -76],
      }),
    }).addTo(this.map);
    return this;
  }

  addPopup(title, content) {
    if (this.marker) {
      this.marker.bindPopup(`<b>${title}</b><br>${content}`);
    }
    return this;
  }

  setView(lat, lng, zoom = 15) {
    this.map.setView([lat, lng], zoom);
    return this;
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),

        (error) => reject(error),
      );
    });
  }

  addOfflineLayer() {
    // Add an offline tile layer as fallback
    this.offlineLayer = L.tileLayer('', {
      maxZoom: 18,
      attribution: 'Offline Map',
      errorTileUrl:
        'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#aaa" font-family="sans-serif">Offline</text></svg>',
    }).addTo(this.map);

    // Try to add the online layer first
    this.onlineLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Check connectivity and switch layers accordingly
    window.addEventListener('online', () => {
      this.map.removeLayer(this.offlineLayer);
      this.onlineLayer.addTo(this.map);
    });

    window.addEventListener('offline', () => {
      this.map.removeLayer(this.onlineLayer);
      this.offlineLayer.addTo(this.map);
    });

    // Initial check
    if (!navigator.onLine) {
      this.map.removeLayer(this.onlineLayer);
      this.offlineLayer.addTo(this.map);
    }
  }

  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }
  }
}
