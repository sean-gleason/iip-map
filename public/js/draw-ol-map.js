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

  let popup = new Popup();
  map.addOverlay(popup);

  let feature = map.forEachFeatureAtPixel(
    evt.pixel,
    function(feature, layer) {
      return feature;
    }
  );

  console.log(feature);

  if (feature) {
    let coord = evt.coordinate;
    if (typeof feature.get('features') === 'undefined') {
      let content = feature.get('content');
    }

    popup.show(coord, content);

  } else {
    popup.hide();
  }

});
