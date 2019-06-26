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
// Add zoom and rotation controls to the map.
const mapNav = new mapboxgl.NavigationControl( { showCompass: false } );
map.addControl( mapNav, 'bottom-right' );

// Add custom pin to map
map.loadImage( '/wp-content/plugins/iip-map/public/images/location-pin.png', ( error, image ) => {
  if ( error ) {
    throw error;
  }
  map.addImage( 'pin', image );
} );

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
        <h4>${card.location.heading}</h4><div class="info-window__field">${field}</div></div>` : '';
    case 'date':
      return card.date.toggled ? `<h4>${card.date.heading}</h4><div class="info-window__date">${field[0].month}/${field[0].day}/${field[0].year}</div>` : '';
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
    default: return `<div class="info-window__general">${field}</div>`;
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
      // check that field contains data before proceeding
      if ( fieldArr[i] ) {
        if ( fieldArr[i].checked ) {
          markup += `<div class="info-window__additional">
        <h4>${o.heading}</h4><div class="info-window__field">${o.inlinePre} ${fieldArr[i].checked} ${o.inlinePost}</div></div>`;
        } else {
          markup += `<div class="info-window__additional">
        <h4>${o.heading}</h4><div class="info-window__field">${o.inlinePre} ${fieldArr[i]} ${o.inlinePost}</div></div>`;
        }
      }
    } );
  } else {
    fieldArr = field.split( ',' );
    added.forEach( ( o, i ) => {
      markup += `<div class="info-window__additional">
        <h4>${o.heading}</h4><div class="info-window__field">${o.inlinePre} ${fieldArr[i]} ${o.inlinePost}</div></div>`;
    } );
  }
  return markup;
};

// add layers (markers) to the map
function drawLayers( m ) {
  const layerIDArray = [];
  let layersUnique = [];
  m.features.forEach( ( marker ) => {
    const eventTopic = marker.properties.topic;
    const layerID = `${eventTopic}`;
    layerIDArray.push( layerID );

    layersUnique = layerIDArray.filter( ( item, index ) => layerIDArray.indexOf( item ) >= index );
  } );

  layersUnique.forEach( ( layerID ) => {
    // we are going to build arrays of markers to store filtered by layerID
    const markers = [];
    m.features.filter( ( marker ) => { // eslint-disable-line array-callback-return
      // build array of markers filter by layerID
      if ( marker.properties.topic === layerID ) {
        // push markers to array
        markers.push( marker );
      }
    } );
    // store events sorted by category
    // we swap the map data with stored data if the filter is used
    // doing this because we cannot update the cluster layer once it's drawn
    sessionStorage.setItem( layerID, JSON.stringify( markers ) );
    // Add a layer for this symbol type if it hasn't been added already.
    if ( !map.getLayer( layerID ) ) {
      map.addLayer( {
        id: layerID,
        type: 'symbol',
        source: 'events',
        layout: {
          'icon-image': 'pin',
          'icon-allow-overlap': false,
          'icon-size': 1
        },
        filter: [
          '==', 'topic', layerID
        ]
      } );
    }

    // display pop up when a marker is clicked
    map.on( 'click', layerID, ( e ) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const { fields } = e.features[0].properties;
      const fieldsObj = JSON.parse( fields );

      // map selected field data to available field object
      const titleField = e.features[0].properties.title || parseSection( mapping.name_arr, fieldsObj );
      const topicField = parseSection( mapping.topic_arr, fieldsObj );
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
        .setHTML( `
                 <div class="info-window" data-sdid="${e.features[0].properties.ext_id}">
                   <div class="info-window__header">
                    ${buildSection( titleField, 'title' )}
                    ${buildSection( topicField, 'topic' )}
                   </div>
                   <div class="info-window__body">
                    ${buildSection( locationField, 'location' )}
                    <div class="info-window__date-time">
                      ${buildSection( dateField, 'date' )}
                      ${buildSection( timeField, 'time' )}
                    </div>
                   </div>
                   <div class="info-window__footer">
                    ${buildAdditional( additionalData )}
                   </div>
                 </div>` )
        .addTo( map );
    } );

    // build out filter <select> by adding each layerID as <option>
    const option = document.createElement( 'option' );
    option.innerHTML = layerID;
    option.value = layerID;
    fragment.appendChild( option );

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
    if ( topicSelect.value !== '' ) {
      map.getSource( 'events' ).setData( {
        type: 'FeatureCollection',
        features: JSON.parse( sessionStorage.getItem( topicSelect.value ) )
      } );
    } else {
      map.getSource( 'events' ).setData( {
        type: 'FeatureCollection',
        features: JSON.parse( sessionStorage.getItem( 'all' ) )
      } );
    }
    layerIDArray.push( topicSelect.value );
  } );

  topicSelect.appendChild( fragment );
}

mapDataXHR.onload = function loadData() {
  const mapDataData = mapDataXHR.response;
  const { features } = mapDataData;
  // store all events for use if filter is reset
  sessionStorage.setItem( 'all', JSON.stringify( features ) );

  map.addSource( 'events', {
    type: 'geojson',
    data: mapDataData,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  } );

  drawLayers( mapDataData );

  map.addLayer( {
    id: 'clusters',
    type: 'circle',
    source: 'events',
    filter: ['has', 'point_count'],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ]
    }
  } );

  map.addLayer( {
    id: 'cluster-count',
    type: 'symbol',
    source: 'events',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Arial Unicode MS Bold'],
      'text-size': 12
    }
  } );
};

// on map load add clustering functionality
map.on( 'load', () => {
  map.on( 'click', 'clusters', ( e ) => {
    const features = map.queryRenderedFeatures( e.point, { layers: ['clusters'] } );
    const clusterId = features[0].properties.cluster_id;
    map.getSource( 'events' ).getClusterExpansionZoom( clusterId, ( err, zoom ) => {
      if ( err ) {
        return;
      }

      map.easeTo( {
        center: features[0].geometry.coordinates,
        zoom: zoom // eslint-disable-line object-shorthand
      } );
    } );
  } );

  map.on( 'mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  } );

  map.on( 'mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  } );
} );
