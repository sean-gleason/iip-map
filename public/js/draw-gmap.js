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
    if ( item.event_topic !== null && item.event_topic !== '' ) {
      topicLine = '<h3 class="iip-map-infowin-header">Topic: ' + item.event_topic + '</h3>';
    } else {
      topicLine = '<div></div>';
    }

    if ( item.event_duration !== null && item.event_duration !== '' ) {
      durationLine = 'Estimated duration: ' + item.event_duration + '</p>';
    } else {
      durationLine = '';
    }

    if ( item.host_name !== null && item.host_name !== '' ) {
      hostLine = item.host_name;
    } else {
      hostLine = '';
    }

    if ( item.contact !== null && item.contact !== '' ) {
      contactLine = item.contact;
    } else {
      contactLine = '';
    }

    if ( hostLine !== '' && contactLine !== '' ) {
      contactBlock = '<h3 class="iip-map-infowin-header">Contact: </h3>' +
      '<p>' + hostLine + '<br />' +
      contactLine + '</p>';
    } else if ( hostLine === '' && contactLine !== '' ) {
      contactBlock = '<h3 class="iip-map-infowin-header">Contact: </h3>' +
      '<p>' + contactLine + '</p>';
    } else if ( hostLine !== '' && contactLine === '' )  {
      contactBlock = '<h3 class="iip-map-infowin-header">Contact: </h3>' +
      '<p>' + hostLine + '</p>';
    } else {
      contactBlock = '';
    }

    // Convert date from YYYY-MM-DD format
    let locale = 'en-us';
    let eventDate = new Date(item.event_date + " " + item.event_time);

    let eventDay = eventDate.getDate();
    let eventMonth = eventDate.toLocaleString(locale, { month: 'long' });
    let dateLine = eventMonth + ' ' + eventDay;
    let eventHour = eventDate.getHours();
    let eventMinutes = eventDate.getMinutes();
    let timeLine = eventHour + ':' + eventMinutes;

    // Text of the InfoWindow
    let windowContent = '<div id="infowindow-' + item.id + '">'+
    '<h1 id="firstHeading" class="iip-map-infowin-header">' + item.event_name + ' </h1>' +
    '<div id="bodyContent" class="iip-map-infowin-body">' +
    topicLine +
    '<p>' + item.event_desc + '</p>'+
    '<h3 class="iip-map-infowin-header">When: </h3>' +
    '<p> On ' + dateLine + ' at ' + timeLine + '. <br />' +
    durationLine +
    '<h3 class="iip-map-infowin-header">Where: </h3>' +
    '<p>' + item.venue_name + '<br />' +
    item.venue_city + '<br />' +
    contactBlock +
    '</div>' +
    '</div>';

    google.maps.event.addListener(marker, 'click', function(evt) {
      map.panTo(marker.getPosition());
      infoWin.setContent(windowContent);
      infoWin.open(map, marker);
    });

    google.maps.event.addListener(map, 'click', function(evt) {
      infoWin.close();
    });

    markers.push(marker);
    markerSpiderfier.addMarker(marker);
  })

  // MarkerClusterer to group adjacent markers
  let markerCluster = new MarkerClusterer(map, markers, {imagePath: '/wp-content/plugins/iip-map/static/m'});
  markerCluster.setMaxZoom(15);
}
