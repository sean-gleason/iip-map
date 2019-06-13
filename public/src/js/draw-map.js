import mapboxgl from 'mapbox-gl';

// shortcode parameters
const mapId = iip_map_params.map_id; // eslint-disable-line no-undef, camelcase
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
map.addControl( new mapboxgl.NavigationControl( { showCompass: false } ) );

// Pull map data from iip-maps API
const mapDataEndpoint = '/wp-json/iip-map/v1/maps/' + mapId; // eslint-disable-line prefer-template
const mapDataXHR = new XMLHttpRequest();
mapDataXHR.open( 'GET', mapDataEndpoint );
mapDataXHR.responseType = 'json';
mapDataXHR.send();

map.on( 'load', () => {
  function plotMarkers( m ) {
    m.features.forEach( ( marker ) => {
      const eventID = marker.properties.ext_id;
      const layerID = 'poi-' + eventID; // eslint-disable-line prefer-template

      // Add a layer for this symbol type if it hasn't been added already.
      if ( !map.getLayer( layerID ) ) {
        map.addLayer( {
          id: layerID,
          type: 'circle',
          source: 'events',
          paint: {
            'circle-color': '#003B55',
            'circle-radius': 5,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          },
          filter: [
            '==', 'ext_id', eventID
          ]
        } );
      }
    } );
  }

  mapDataXHR.onload = function loadData() {
    const mapDataData = mapDataXHR.response;

    map.addSource( 'events', {
      type: 'geojson',
      data: mapDataData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    } );


    plotMarkers( mapDataData );
  };
} );
