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
    zoom: parseInt(zoom)
  });

  fetch('/wp-json/iip-map/v1/map/' + map_id)
    .then(function(response){return response.json()})
    .then(plotMarkers);
}

var markers = [];

function plotMarkers(m) {
  var infoWin = new google.maps.InfoWindow();

  m.forEach(function (entry) {
    entry.forEach(function (item, index) {
      var latLng = new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng))
      var marker = new google.maps.Marker({
        position: latLng,
      });

      var windowContent = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="iip-map-infowin-header">' + item.event_name + ' </h1>' +
      '<div id="bodyContent" class="iip-map-infowin-body">' +
      '<h3 class="iip-map-infowin-header">Topic: ' + item.event_topic + '</h3>' +
      '<p>' + item.event_desc + '</p>'+
      '<h3 class="iip-map-infowin-header">When: </h3>' +
      '<p> On ' + item.event_date + ' at ' + item.event_time + '. <br />' +
      'The event will last ' + item.event_duration + '</p>' +
      '<h3 class="iip-map-infowin-header">Where: </h3>' +
      '<p>' + item.venue_name + '<br />' +
      item.venue_address + '<br />' +
      item.venue_city + '<br />' +
      'Contact: ' + item.contact + '<br />' +
      '</div>' +
      '</div>';

      google.maps.event.addListener(marker, 'click', function(evt) {
        infoWin.setContent(windowContent);
        infoWin.open(map, marker);
      });
      markers.push(marker);
    });
  })

  var markerCluster = new MarkerClusterer(map, markers, {imagePath: '/wp-content/plugins/iip-map/images/m'});
}
