import mapboxgl from '../node_modules/mapbox-gl';

const apiKey = iip_map_params.mapbox_api_key; // eslint-disable-line no-undef, camelcase
const mapZoom = iip_map_params.map_zoom; // eslint-disable-line no-undef, camelcase
const lat = iip_map_params.map_center_lat; // eslint-disable-line no-undef, camelcase
const lng = iip_map_params.map_center_lng; // eslint-disable-line no-undef, camelcase

mapboxgl.accessToken = apiKey;

const map = new mapboxgl.Map( {
  container: 'map',
  style: 'mapbox://styles/jspellman814/cjwiaf6wi05nk1dlue7undbxu',
  center: [lat, lng],
  zoom: mapZoom
} );

// Mapbox controls
// Disable zoom on scroll
map.scrollZoom.disable();
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl( { showCompass: false } ));
