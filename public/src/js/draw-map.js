import mapboxgl from 'mapbox-gl';

// shortcode parameters
const mapId = iip_map_params.map_id; // eslint-disable-line no-undef, camelcase
const apiKey = iip_map_params.mapbox_api_key; // eslint-disable-line no-undef, camelcase
const mapZoom = iip_map_params.map_zoom; // eslint-disable-line no-undef, camelcase
const lat = iip_map_params.map_center_lat; // eslint-disable-line no-undef, camelcase
const lng = iip_map_params.map_center_lng; // eslint-disable-line no-undef, camelcase
const mapping = iip_map_params.mapping; // eslint-disable-line no-undef, camelcase, prefer-destructuring
const { card } = iip_map_params; // eslint-disable-line no-undef, camelcase

// get topic select
const topicSelect = document.getElementById( 'topic-select' );
const fragment = document.createDocumentFragment();

mapboxgl.accessToken = apiKey;

const map = new mapboxgl.Map( {
  container: 'map',
  style: 'mapbox://styles/jspellman814/cjwiaf6wi05nk1dlue7undbxu',
  center: [lat, lng],
  zoom: mapZoom
} );

// Configure Map controls
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

const parseSection = ( sectionMap, fields, type = null ) => {
  const vals = [];
  switch ( type ) {
    case 'date':
      sectionMap.forEach( ( { field } ) => {
        if ( field in fields && fields[field] ) {
          vals.push( fields[field] );
        }
      } );
      return vals;
    case 'time':
      sectionMap.forEach( ( { field } ) => {
        if ( field in fields && fields[field] ) {
          vals.push( fields[field] );
        }
      } );
      return vals;
    default:
      sectionMap.forEach( ( { field } ) => {
        if ( field in fields && fields[field] ) {
          vals.push( fields[field].replace( /^[ \t\r\n]+|[ \t\r\n]+$/g, '' ) );
        }
      } );
      return vals.join( ', ' );
  }
};

const buildSection = ( field, sectionName = '' ) => {
  switch ( sectionName ) {
    case 'title':
      return card.title.toggled ? '<h3 class="info-window__title">' + card.title.preTitle + ' ' + field + ' ' + card.title.postTitle + '</h3>' : ''; // eslint-disable-line prefer-template
    case 'location':
      return card.location.toggled ? '<p class="info-window__location"><strong>' + card.location.heading + '</strong> ' + field + '</p>' : ''; // eslint-disable-line prefer-template
    case 'date':
      return card.date.toggled ? '<p class="info-window__date"><strong>' + card.date.heading + '</strong> ' + field[0].month + '/' + field[0].day + '/' + field[0].year + '</p>' : ''; // eslint-disable-line prefer-template
    case 'time':
      return card.time.toggled ? '<p class="info-window__time">' + field[0].hours + ':' + field[0].minutes + ' ' + field[0].am_pm + '</p>' : ''; // eslint-disable-line prefer-template
    default: return '';
  }
};

function plotMarkers( m ) {
  const layerIDArray = [];
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

    layerIDArray.push( layerID );
    const option = document.createElement( 'option' );
    option.innerHTML = layerID;
    option.value = layerID;
    fragment.appendChild( option );

    map.on( 'click', layerID, ( e ) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const fieldsString = e.features[0].properties.fields; // eslint-disable-line prefer-destructuring
      const fieldsObj = JSON.parse( fieldsString );

      const titleField = parseSection( mapping.name_arr, fieldsObj );
      const locationField = parseSection( mapping.location_arr, fieldsObj );
      const dateField = parseSection( mapping.date_arr, fieldsObj, 'date' );
      const timeField = parseSection( mapping.time_arr, fieldsObj, 'time' );

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while ( Math.abs( e.lngLat.lng - coordinates[0] ) > 180 ) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup( { offset: 25 } )
        .setLngLat( coordinates )
        .setHTML( '<div class="info-window ' + titleField + '">' + buildSection( titleField, 'title' ) + buildSection( locationField, 'location' ) + buildSection( dateField, 'date' ) + buildSection( timeField, 'time' ) + '</div>' ) // eslint-disable-line prefer-template
        .addTo( map );
    } );

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on( 'mouseenter', layerID, () => {
      map.getCanvas().style.cursor = 'pointer';
    } );

    // Change it back to a pointer when it leaves.
    map.on( 'mouseleave', layerID, () => {
      map.getCanvas().style.cursor = '';
    } );
  } );

  topicSelect.addEventListener( 'change', () => {
    const layerIDArrayLength = layerIDArray.length;
    for ( let i = 0; i < layerIDArrayLength; i++ ) { // eslint-disable-line no-plusplus
      map.setLayoutProperty( layerIDArray[i], 'visibility', 'visible' );
    }

    const index = layerIDArray.indexOf( topicSelect.value );
    // loop through layerIDArray and checked box value (set as layerID)
    if ( index !== -1 ) {
      layerIDArray.splice( index, 1 );
      const splicedArrayLength = layerIDArray.length;
      for ( let count = 0; count < splicedArrayLength; count++ ) { // eslint-disable-line no-plusplus
        map.setLayoutProperty( layerIDArray[count], 'visibility', 'none' );
      }
    }
    layerIDArray.push( topicSelect.value );
  } );

  topicSelect.appendChild( fragment );
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
