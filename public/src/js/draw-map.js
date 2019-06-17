import mapboxgl from 'mapbox-gl';

// shortcode parameters
const mapId = iip_map_params.map_id; // eslint-disable-line no-undef, camelcase
const apiKey = iip_map_params.mapbox_api_key; // eslint-disable-line no-undef, camelcase
const mapZoom = iip_map_params.map_zoom; // eslint-disable-line no-undef, camelcase
const lat = iip_map_params.map_center_lat; // eslint-disable-line no-undef, camelcase
const lng = iip_map_params.map_center_lng; // eslint-disable-line no-undef, camelcase
const { mapping } = iip_map_params; // eslint-disable-line no-undef, camelcase
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
const mapDataEndpoint = `/wp-json/iip-map/v1/maps/${mapId}`;
const mapDataXHR = new XMLHttpRequest();
mapDataXHR.open( 'GET', mapDataEndpoint );
mapDataXHR.responseType = 'json';
mapDataXHR.send();

// convert 12 to 24 hour format if user chooses to
const convertTime12to24 = ( time12h ) => {
  const [time, modifier] = time12h.split( ' ' );
  let [hours, minutes] = time.split( ':' ); // eslint-disable-line prefer-const
  if ( hours === '12' ) {
    hours = '00';
  }
  if ( modifier === 'PM' ) {
    hours = parseInt( hours, 10 ) + 12;
  }
  return `${hours}:${minutes}`;
};

// map mapped fields to available fields based on screendoor ID
const parseSection = ( sectionMap, fields ) => {
  const vals = [];

  sectionMap.forEach( ( { fieldType, field } ) => {
    // http://dobtco.github.io/screendoor-api-docs/#spec-for-the-response-hash
    switch ( fieldType ) {
      case 'text':
      case 'paragraph':
      case 'dropdown':
      case 'email':
      case 'phone':
      case 'numeric':
      case 'website':
        if ( field in fields && fields[field] ) {
          vals.push( fields[field].replace( /^[ \t\r\n]+|[ \t\r\n]+$/g, '' ) );
        }
        break;
      case 'date':
      case 'time':
      case 'address':
      case 'price':
        if ( field in fields && fields[field] ) {
          vals.push( fields[field] );
        }
        break;
      case 'radio':
        if ( field in fields && fields[field] ) {
          vals.push( fields[field] );
        }
        break;
      default:
        if ( field in fields && fields[field] ) {
          vals.push( fields[field] );
        }
        return '';
    }
  } );
  return vals;
};

// build our sections for pop ups
const buildSection = ( field, sectionName = '' ) => {
  switch ( sectionName ) {
    case 'title':
      return card.title.toggled ? `<h3 class="info-window__title">
        ${card.title.preTitle} ${field} ${card.title.postTitle}</h3>` : '';
    case 'location':
      return card.location.toggled ? `<div class="info-window__location">
        <h4>${card.location.heading}</h4>${field}</div>` : '';
    case 'date':
      return card.date.toggled ? `<div class="info-window__date">
        <h4>${card.date.heading}</h4>${field[0].month}/${field[0].day}/${field[0].year}</div>` : '';
    case 'time':
      if ( card.time.toggled === true ) {
        if ( card.time.timeFormat === '24hour' ) {
          const time = convertTime12to24( `${field[0].hours}:${field[0].minutes} ${field[0].am_pm}` );
          return `<div class="info-window__time">${time}</div>`;
        }
        if ( card.time.timeFormat === '12hour' ) {
          return `<div class="info-window__time">${field[0].hours}:${field[0].minutes} ${field[0].am_pm}</div>`;
        }
      } else {
        return '';
      }
      break;
    default: return '';
  }
};

// build additional data section for pop ups
// broken into it's own function due to the need to lop through mapped fields
const buildAdditional = ( field ) => {
  let fieldArr;
  let markup = '';
  const added = card.added_arr;
  if ( field.constructor === Array ) {
    fieldArr = field;
    // pull out field id
    added.forEach( ( o, i ) => {
      if ( fieldArr[i].checked ) {
        markup += `<div class="info-window__additional">
        <h4>${o.heading}</h4>${o.inlinePre} ${fieldArr[i].checked} ${o.inlinePost}</div>`;
      } else {
        markup += `<div class="info-window__additional">
        <h4>${o.heading}</h4>${o.inlinePre} ${fieldArr[i]} ${o.inlinePost}</div>`;
      }
    } );
  } else {
    fieldArr = field.split( ',' );
    added.forEach( ( o, i ) => {
      markup += `<div class="info-window__additional">
        <h4>${o.heading}</h4>${o.inlinePre} ${fieldArr[i]} ${o.inlinePost}</div>`;
    } );
  }
  return markup;
};

// add layers (markers) to the map
function drawLayers( m ) {
  const layerIDArray = [];
  m.features.forEach( ( marker ) => {
    const eventID = marker.properties.ext_id;
    const layerID = `poi-${eventID}`;

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
    // build out filter <select> by adding each layerID as <option>
    const option = document.createElement( 'option' );
    option.innerHTML = layerID;
    option.value = layerID;
    fragment.appendChild( option );

    // display pop up when a marker is clicked
    map.on( 'click', layerID, ( e ) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const { fields } = e.features[0].properties;
      const fieldsObj = JSON.parse( fields );

      // map selected field data to available field object
      const titleField = parseSection( mapping.name_arr, fieldsObj );
      const locationField = parseSection( mapping.location_arr, fieldsObj );
      const dateField = parseSection( mapping.date_arr, fieldsObj );
      const timeField = parseSection( mapping.time_arr, fieldsObj );
      const additionalData = parseSection( mapping.other_arr, fieldsObj );
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while ( Math.abs( e.lngLat.lng - coordinates[0] ) > 180 ) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup( { offset: 25 } )
        .setLngLat( coordinates )
        .setHTML( `<div class="info-window">
            ${buildSection( titleField, 'title' )}${buildSection( locationField, 'location' )}${buildSection( dateField, 'date' )}${buildSection( timeField, 'time' )}${buildAdditional( additionalData )}</div>` )
        .addTo( map );
    } );

    // Change the cursor to a pointer when the mouse is over the layer
    map.on( 'mouseenter', layerID, () => {
      map.getCanvas().style.cursor = 'pointer';
    } );

    // Change it back to a pointer when it leaves
    map.on( 'mouseleave', layerID, () => {
      map.getCanvas().style.cursor = '';
    } );
  } );

  // filtering logic - show/hide layers
  topicSelect.addEventListener( 'change', () => {
    const layerIDArrayLength = layerIDArray.length;
    for ( let i = 0; i < layerIDArrayLength; i += 1 ) {
      map.setLayoutProperty( layerIDArray[i], 'visibility', 'visible' );
    }

    const index = layerIDArray.indexOf( topicSelect.value );
    // loop through layerIDArray and checked box value (set as layerID)
    if ( index !== -1 ) {
      layerIDArray.splice( index, 1 );
      const splicedArrayLength = layerIDArray.length;
      for ( let count = 0; count < splicedArrayLength; count += 1 ) {
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

  drawLayers( mapDataData );
};
