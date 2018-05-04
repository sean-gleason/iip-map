var googleKey = iip_map_params.google_api_key;

var map_id = iip_map_params.map_id;
var zoom = iip_map_params.map_zoom;
var lat = iip_map_params.map_center_lat;
var lng = iip_map_params.map_center_lng;

document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    var maps_api_js = document.createElement('script');
    maps_api_js.type = 'text/javascript';
    maps_api_js.src = 'https://maps.googleapis.com/maps/api/js?key=' + googleKey + '&callback=initMap' ;
    document.getElementsByTagName('head')[0].appendChild(maps_api_js);

    var maps_clusters_js = document.createElement('script');
    maps_clusters_js.type = 'text/javascript';
    maps_clusters_js.src = '/wp-content/plugins/iip-map/js/markerclusterer.js' ;
    document.getElementsByTagName('head')[0].appendChild(maps_clusters_js);
  }
});

var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: parseFloat(lat), lng: parseFloat(lng)},
    zoom: parseFloat(zoom)
  });

  // fetch('/wp-json/iip-map/v1/map/' + map_id)
  fetch('/wp-content/plugins/iip-map/public/map-data/markers' + map_id + '.json')
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
