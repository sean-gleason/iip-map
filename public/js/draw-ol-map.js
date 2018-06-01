// Import shortcode parameters
let map_id = iip_map_params.map_id;
let zoom = iip_map_params.map_zoom;
let lat = iip_map_params.map_center_lat;
let lng = iip_map_params.map_center_lng;

// Load popup script on page load (required for the info windows)
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    let maps_api_js = document.createElement('script');
    maps_api_js.type = 'text/javascript';
    maps_api_js.src = 'https://unpkg.com/ol-popup@3.0.0';
    document.getElementsByTagName('head')[0].appendChild(maps_api_js);
  }
});

// Pull map data from iip-maps API
let mapDataEndpoint = '/wp-json/iip-map/v1/maps/' + map_id;
let mapDataXHR = new XMLHttpRequest();
mapDataXHR.open('GET', mapDataEndpoint);
mapDataXHR.responseType = 'json';s
mapDataXHR.send();

mapDataXHR.onload = function() {
  let mapDataData = mapDataXHR.response;
  let mapDataStatus = mapDataXHR.statusText

  plotMarkers(mapDataData);
}

// Set up map embed
const markerSource = new ol.source.Vector();

var markerStyle = new ol.style.Style({
  image: new ol.style.Icon( ({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    opacity: 0.75,
    src: '/wp-content/plugins/iip-map/images/map-pin.png'
  }))
});

let map = new ol.Map({
  target: 'map',
  controls: ol.control.defaults({
    attributionOptions: {
      collapsible: true
    }
  }),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
    new ol.layer.Vector({
      source: markerSource,
      style: markerStyle,
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([parseFloat(lng), parseFloat(lat)]),
    zoom: parseInt(zoom),
  })
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

    // Text of the InfoWindow
    let windowContent = '<div class="iip-map-ol-popup" id="infowindow-' + item.id + '">'+
    '<h1 id="firstHeading" class="iip-map-ol-popup-header">' + item.event_name + ' </h1>' +
    '<div id="bodyContent" class="iip-map-ol-popup-body">' +
    topicLine +
    '<p>' + item.event_desc + '</p>'+
    '<h3 class="iip-map-ol-popup-header">When: </h3>' +
    '<p> On ' + item.event_date + ' at ' + item.event_time + '. <br />' +
    'Estimated duration: ' + item.event_duration + '</p>' +
    '<h3 class="iip-map-ol-popup-header">Where: </h3>' +
    '<p>' + hostLine +
    item.venue_address + '<br />' +
    item.venue_city + '<br />' +
    contactLine + '</p>' +
    '</div>' +
    '</div>';

    // Define markers
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform(latLng, 'EPSG:4326',
        'EPSG:3857')),
      content: windowContent
    });

    markerSource.addFeature(marker);

  });
}

// Add click event to markers to show infowindow
map.on('click', function(evt) {
  let feature = map.forEachFeatureAtPixel(evt.pixel,
    function(feature) {
      return feature;
    }
  );

  let popup = new Popup({insertFirst: false});
  map.addOverlay(popup);

  popup.show(evt.coordinate, '<div><p>' + feature.get('content') + '</p></div>');
});
