// Import shortcode parameters
let map_id = iip_map_params.map_id;
let zoom = iip_map_params.map_zoom;
let lat = iip_map_params.map_center_lat;
let lng = iip_map_params.map_center_lng;

// Pull map data from iip-maps API
let mapDataEndpoint = '/wp-json/iip-map/v1/maps/' + map_id;
let mapDataXHR = new XMLHttpRequest();
mapDataXHR.open('GET', mapDataEndpoint);
mapDataXHR.responseType = 'json';
mapDataXHR.send();

mapDataXHR.onload = function() {
  let mapDataData = mapDataXHR.response;
  let mapDataStatus = mapDataXHR.statusText

  plotMarkers(mapDataData);
}

// Set up markers
const markerSource = new ol.source.Vector();

// Set marker style
let markerStyle = new ol.style.Style({
  image: new ol.style.Icon( ({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    opacity: 0.75,
    src: '/wp-content/plugins/iip-map/images/map-pin.png'
  }))
});

// Add clustering
let clusterSource = new ol.source.Cluster({
  distance: (50),
  source: markerSource
});

// Set cluster style
let styleCache = {};
function clusterStyle(feature) {
  let size = feature.get('features').length;
  let style = styleCache[size];

  if (!style) {
    style = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 15,
        stroke: new ol.style.Stroke({
          color: '#fff'
        }),
        fill: new ol.style.Fill({
          color: '#0081FF'
        })
      }),
      text: new ol.style.Text({
        text: size.toString(),
        fill: new ol.style.Fill({
          color: '#fff'
        })
      })
    });
    styleCache[size] = style;
  }

  return style;
}

// Establish map layers
let baseLayer = new ol.layer.Tile({
  source: new ol.source.OSM(),
});

let clusterLayer = new ol.layer.Vector({
  source: clusterSource,
  style: clusterStyle,
});

let markerLayer = new ol.layer.Vector({
  source: clusterSource,
  style: markerStyle,
});

// Create the map
let mapCenter = new ol.View({
  center: ol.proj.fromLonLat([parseFloat(lng), parseFloat(lat)]),
  zoom: parseInt(zoom),
});

let map = new ol.Map({
  target: 'map',
  controls: ol.control.defaults({
    attributionOptions: {
      collapsible: true
    }
  }),
  layers: [
    baseLayer,
    clusterLayer
  ],
  view: mapCenter
});

// Plot markers onto map
function plotMarkers(m) {

  m.forEach(function (item) {
    let markers = [];
    let latLng = [parseFloat(item.lng), parseFloat(item.lat)];

    // Conditionals for the InfoWindows
    if ( item.event_topic !== null ) {
      topicLine = '<h3 class="iip-map-ol-popup-header">Topic: ' + item.event_topic + '</h3>';
    } else {
      topicLine = '<div></div>';
    }

    if ( item.host_name !== null ) {
      hostLine = 'Hosted by: ' + item.host_name + '<br />';
    } else {
      hostLine = '';
    }

    if ( item.contact !== null && item.contact !== '') {
      contactLine = 'Contact: ' + item.contact;
    } else {
      contactLine = '';
    }

    // Convert date from YYYY-MM-DD format
    let locale = 'en-us';
    let eventDate = new Date(item.event_date);

    let eventDay = eventDate.getDate();
    let eventMonth = eventDate.toLocaleString(locale, { month: 'long' });
    let dateLine = eventMonth + ' ' + eventDay;

    // Text of the InfoWindow
    let windowText = '<div id="bodyContent-' + item.id + '" class="iip-map-ol-popup-body">' +
    topicLine +
    '<p>' + item.event_desc + '</p>'+
    '<h3 class="iip-map-ol-popup-header">When: </h3>' +
    '<p> On ' + dateLine + ' at ' + item.event_time + '. <br />' +
    'Estimated duration: ' + item.event_duration + '</p>' +
    '<h3 class="iip-map-ol-popup-header">Where: </h3>' +
    '<p>' + hostLine +
    item.venue_address + '<br />' +
    item.venue_city + '<br />' +
    contactLine + '</p>' +
    '</div>';

    // Div for InfoWindow
    let windowContent = '<div class="iip-map-ol-popup" id="infowindow-' + item.id + '">' +
    '<h1 id="firstHeading" class="iip-map-ol-popup-header">' + item.event_name + ' </h1>' +
    windowText +
    '</div>';

    // Define markers
    var marker = new ol.Feature({
      content: windowContent,
      geometry: new ol.geom.Point(ol.proj.transform(latLng, 'EPSG:4326',
        'EPSG:3857')),
      id: item.id,
      text: windowText,
      title: item.event_name
    });

    markerSource.addFeature(marker);

  });
}

// Add click event to markers to show infowindow
map.on('click', function(evt) {

  let popup = new Popup();
  map.addOverlay(popup);

  //Set event listener for eech marker
  let feature = map.forEachFeatureAtPixel(
    evt.pixel,
    function(feature, layer) {
      return feature;
    }
  );

  if (feature) {
    let coord = evt.coordinate;
    let data = feature.get('features');
    let content = data[0].N.content;
    let featureNum = data.length;

    // Show infowindow if only one event in cluster
    if (featureNum === 1) {
      popup.show(coord, content);

    // Show accoridon of events if multiple events in cluster
    } else {
      let titleList = document.createElement('div');
      titleList.className = 'iip-map-ol-popup';

      for ( var i = 0; i < featureNum; i++) {

        let itemId = data[i].N.id;
        let itemTitle = '<h1 class="marker-event-title iip-map-ol-popup-header" id="title-marker-' + itemId + '">' + data[i].N.title + '</h1>';
        let itemText = '<div class="marker-text" id="text-marker-' + itemId + '">' + data[i].N.text + '</div>';
        let itemContainer = '<div class="marker-accordion closed">' + itemTitle + itemText + '</div>';

        titleList.insertAdjacentHTML('afterbegin', itemContainer);

      }
      popup.show(coord, titleList);

      // Center the map on infowindow
      let mapSize = map.getSize();
      let mapCenterX = mapSize[0] / 2;
      let mapCenterY = mapSize[1] / 4;

      mapCenter.centerOn(coord, map.getSize(), [mapCenterX, mapCenterY]);

      // Toggle description text when clicking on event title
      let accItem = document.getElementsByClassName('marker-accordion');
      let accHead = document.getElementsByClassName('marker-event-title');
      for (var i = 0; i < accHead.length; i++) {
        accHead[i].addEventListener('click', toggleItem, false);
      }

      function toggleItem() {

        let itemClass = this.parentNode.className;

        for (var i = 0; i < accItem.length; i++) {
          accItem[i].className = 'marker-accordion closed';
        }
        if (itemClass == 'marker-accordion closed') {
          this.parentNode.className = 'marker-accordion opened';
        }
      }

    }

  } else {
    popup.hide();
  }

});
