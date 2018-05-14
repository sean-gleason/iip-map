// Set Screendoor API endpoint
var endpoint = 'https://screendoor.dobt.co/api/projects/' + iip_map_params.screendoor_project + '/responses?per_page=20&v=0&api_key=' + iip_map_params.screendoor_api_key;

// Get field IDs
var googleKey = iip_map_params.google_api_key;
var mapId = iip_map_params.map_data_id;
var cityField = iip_map_params.screendoor_city;
var regionField = iip_map_params.screendoor_region;
var countryField = iip_map_params.screendoor_country;

document.addEventListener('DOMContentLoaded', function () {
  var maps_api_js = document.createElement('script');
  maps_api_js.type = 'text/javascript';
  maps_api_js.src = 'https://maps.googleapis.com/maps/api/js?key=' + googleKey;
  document.getElementsByTagName('head')[0].appendChild(maps_api_js);
});

const btn = document.getElementById('iip-map-geocode');
btn.addEventListener('click', getScreendoorData);

function getScreendoorData() {
  // Make request to Screendoor API
  var request = new XMLHttpRequest();
  request.open('GET', endpoint);
  request.responseType = 'json';
  request.send();

  request.onload = function() {
    var data = request.response;

    geocodeAddress(data);
  }
}

// Geocode event locations to latitude/longitude
function geocodeAddress(jsonObj) {
  jsonObj.forEach(function(item) {

    // Pull out address info and write to a string
    var address = item.responses[cityField] + ', ' + item.responses[countryField];

    var map_id = mapId;
    var venue_city = item.responses[cityField];
    var venue_region = item.responses[regionField];
    var venue_country = item.responses[countryField];

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        var lat = results[0].geometry.location.lat();
        var lng = results[0].geometry.location.lng();

        var data = {
          'action': 'map_ajax',
          'map_id': map_id,
          'venue_city': venue_city,
          'venue_region': venue_region,
          'venue_country': venue_country,
          'lat': lat,
          'lng': lng
        };

        populateSQLTable(data);
      };
    });
  });
}

// Write event information to the database
function populateSQLTable(data) {
  jQuery.ajax(
    {
      type: 'post',
      dataType: 'json',
      url: iip_map_params.ajax_url,
      data: data
    }
  );
}
