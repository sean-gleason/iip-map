// Pull Screendoor project id and API key from admin config
var endpoint = 'https://screendoor.dobt.co/api/projects/' + iip_map_params.screendoor_project + '/responses?v=0&api_key=' + iip_map_params.screendoor_api_key;

var mapId = iip_map_params.map_data_id
var cityField = iip_map_params.screendoor_city[0];
var regionField = iip_map_params.screendoor_region[0];
var countryField = iip_map_params.screendoor_country[0];

var googleKey = iip_map_params.google_api_key;

// Make request to Screendoor API
var request = new XMLHttpRequest();
request.open('GET', endpoint);
request.responseType = 'json';
request.send();

request.onload = function() {
  var data = request.response;

  populateSQLTable(data);
  getAddressString(data);

}

function populateSQLTable(jsonObj) {
  jsonObj.forEach(function(item) {
    var map_id = mapId;

    var venue_city = item.responses[cityField];
    var venue_region = item.responses[regionField];
    var venue_country = item.responses[countryField];

    var entry_data = {
      map_id: map_id,
      venue_city: venue_city,
      venue_region: venue_region,
      venue_country: venue_country
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://yali.dev.local/wp-content/plugins/iip-map/admin/save_data.php');
    xhr.send(JSON.stringify(entry_data));

  });
}

// Pull out address info and write to a string
function getAddressString(jsonObj) {
  jsonObj.forEach(function(item) {
    address = item.responses[cityField] + ', ' + item.responses[countryField];

    geocodeAddress(address);
  });
}

// Geocode event locations to latitude/longitude
function geocodeAddress(address) {
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode( { 'address': address}, function(results, status) {

    if (status == 'OK') {
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();

      var latLng = { lat: lat, lng: lng}

    }
  });
}
