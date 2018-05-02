// Pull Screendoor project id and API key from admin config
var endpoint = 'https://screendoor.dobt.co/api/projects/' + iip_map_params.screendoor_project + '/responses?v=0&api_key=' + iip_map_params.screendoor_api_key;

var cityField = iip_map_params.screendoor_city;
var regionField = iip_map_params.screendoor_region;
var countryField = iip_map_params.screendoor_country;

var googleKey = iip_map_params.google_api_key;

// Make XHR request to Screendoor
var request = new XMLHttpRequest();
request.open('GET', endpoint);
request.responseType = 'json';
request.send();

request.onload = function() {
  var data = request.response;

  printResponse(data);

}

function printResponse(jsonObj) {
  jsonObj.forEach(function(item) {
    address = item.responses[cityField] + ', ' + item.responses[countryField];

    geocodeAddress(address);
  });
}

// function geocodeAddress(address) {
//   var response = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + googleKey;
//
//   var request = new XMLHttpRequest();
//   request.open('GET', response);
//   request.responseType = 'json';
//   request.send();
//
//   request.onload = function() {
//     var data = request.response;
//
//     newMaker(data);
//   }
// }
// var features = [];
//
// function newMaker(data) {
//
//   if (data.status == 'OK') {
//     var latLng = data.results[0].geometry.location;
//
//     features.push(latLng);
//
//     var marker = new google.maps.Marker({
//       position: latLng,
//     });
//     // console.log(marker.position)
//   }
//
//   // console.log(features);
// }
//
// features.forEach(function(feature) {
//   var marker = new google.maps.Marker({
//     position: feature,
//   });
//   console.log(marker.position);
// });
// Extract city and country for each screendoor entry
// function initMap() {
//   var latLng = new google.maps.LatLng(lat, lng)
//   var mapOptions = {
//     zoom: zoom,
//     center: latLng
//   }
//
//   var map = new google.maps.Map(document.getElementById("map"), mapOptions);
//   var geocoder = new google.maps.Geocoder();
// }

// Geocode event locations to latitude/longitude
function geocodeAddress(address) {
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode( { 'address': address}, function(results, status) {

    if (status == 'OK') {
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();

      var latLng = { lat: lat, lng: lng}

      var marker = new google.maps.Marker({
        map: map,
        position: latLng,
      });

      console.log(marker.position);

    }
  });
}
