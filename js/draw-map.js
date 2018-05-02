var googleKey = iip_map_params.google_api_key;

var zoom = iip_map_params.map_zoom;
var lat = iip_map_params.map_center_lat;
var lng = iip_map_params.map_center_lng;

document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?key=' + googleKey + '&callback=initMap' ;
    document.getElementsByTagName('head')[0].appendChild(js_file);

    var js_file2 = document.createElement('script');
    js_file2.type = 'text/javascript';
    js_file2.src = '/wp-content/plugins/iip-map/js/markerclusterer.js' ;
    document.getElementsByTagName('head')[0].appendChild(js_file2);
  }
});

var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: parseFloat(lat), lng: parseFloat(lng)},
    zoom: parseFloat(zoom)
  });

  fetch('/wp-content/plugins/iip-map/js/markers.json')
    .then(function(response){return response.json()})
    .then(plotMarkers);
}

var markers;

function plotMarkers(m) {
  markers = [];

  m.forEach(function (entry) {
    var latLng = new google.maps.LatLng(entry.lat, entry.lng)
    var marker = new google.maps.Marker({
      position: latLng
    });
    markers.push(marker);
  });

  var markerCluster = new MarkerClusterer(map, markers, {imagePath: '/wp-content/plugins/iip-map/images/m'});
}
