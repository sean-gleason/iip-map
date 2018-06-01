let googleKey = iip_map_params.google_api_key;

let map_id = iip_map_params.map_id;
let zoom = iip_map_params.map_zoom;
let lat = iip_map_params.map_center_lat;
let lng = iip_map_params.map_center_lng;

// Load in Google Maps API script and markerclusterer scripts
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    let maps_api_js = document.createElement('script');
    maps_api_js.type = 'text/javascript';
    maps_api_js.src = 'https://maps.googleapis.com/maps/api/js?key=' + googleKey + '&callback=initMap' ;
    document.getElementsByTagName('head')[0].appendChild(maps_api_js);
  }
});

let map;

// Load map on page
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: parseFloat(lat), lng: parseFloat(lng)},
    zoom: parseInt(zoom)
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
}

let markers = [];

// Plot markers onto map
function plotMarkers(m) {
  let infoWin = new google.maps.InfoWindow();

  // Spiderfy to seperate out events in the same location
  let markerSpiderfier = new OverlappingMarkerSpiderfier(map, {
    markersWontMove: true,
    markersWontHide: true,
    basicFormatEvents: true
  });

  m.forEach(function (item) {
    let latLng = new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng))
    let marker = new google.maps.Marker({
      position: latLng,
    });

    // Conditionals for the InfoWindows
    if ( item.event_topic !== null ) {
      topicLine = '<h3 class="iip-map-infowin-header">Topic: ' + item.event_topic + '</h3>';
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
    let windowContent = '<div id="infowindow-' + item.id + '">'+
    '<h1 id="firstHeading" class="iip-map-infowin-header">' + item.event_name + ' </h1>' +
    '<div id="bodyContent" class="iip-map-infowin-body">' +
    topicLine +
    '<p>' + item.event_desc + '</p>'+
    '<h3 class="iip-map-infowin-header">When: </h3>' +
    '<p> On ' + item.event_date + ' at ' + item.event_time + '. <br />' +
    'Estimated duration: ' + item.event_duration + '</p>' +
    '<h3 class="iip-map-infowin-header">Where: </h3>' +
    '<p>' + hostLine +
    item.venue_address + '<br />' +
    item.venue_city + '<br />' +
    contactLine + '</p>' +
    '</div>' +
    '</div>';

    google.maps.event.addListener(marker, 'click', function(evt) {
      infoWin.setContent(windowContent);
      infoWin.open(map, marker);
    });

    markers.push(marker);
    markerSpiderfier.addMarker(marker);
  })

  // MarkerClusterer to group adjacent markers
  let markerCluster = new MarkerClusterer(map, markers, {imagePath: '/wp-content/plugins/iip-map/images/m'});
  markerCluster.setMaxZoom(15);
}
