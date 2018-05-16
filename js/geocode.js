// Set Screendoor API endpoint
var endpoint = 'https://screendoor.dobt.co/api/projects/' + iip_map_params.screendoor_project + '/responses?per_page=20&v=0&api_key=' + iip_map_params.screendoor_api_key;

// Get field IDs
var googleKey = iip_map_params.google_api_key;
var mapId = iip_map_params.map_data_id;
var venueField = iip_map_params.screendoor_venue;
var addressField = iip_map_params.screendoor_address;
var cityField = iip_map_params.screendoor_city;
var regionField = iip_map_params.screendoor_region;
var countryField = iip_map_params.screendoor_country;
var eventField = iip_map_params.screendoor_event;
var descField = iip_map_params.screendoor_desc;
var dateField = iip_map_params.screendoor_date;
var timeField = iip_map_params.screendoor_time;
var durationField = iip_map_params.screendoor_duration;
var topicField = iip_map_params.screendoor_topic;
var contactField = iip_map_params.screendoor_contact

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
    var status = request.statusText

    geocodeAddress(data);
    statusDisplay('Call to Screendoor: ' + status);
  }
}

// Report out status
function statusDisplay(status) {
  if (typeof status !== 'string') {
    throw new Error('statusDisplay(): argument must be a string');
  }
  $('#geocoder-return').append(status + `<br />`);
}

// Geocode event locations to latitude/longitude
function geocodeAddress(jsonObj) {
  jsonObj.forEach(function(item) {

    // Pull out address info and write to a string
    var address = item.responses[addressField] + ', ' + item.responses[cityField] + ', ' + item.responses[countryField];
    var addressSimplified = item.responses[cityField] + ', ' + item.responses[countryField];

    var map_id = mapId;
    var venue_name = item.responses[venueField];
    var venue_address = item.responses[addressField];
    var venue_city = item.responses[cityField];
    var venue_region = item.responses[regionField];
    var venue_country = item.responses[countryField];
    var event_name = item.responses[eventField];
    var event_desc = item.responses[descField];
    var event_date = item.responses[dateField];
    var event_time = item.responses[timeField];
    var event_duration = item.responses[durationField];
    var event_topic = item.responses[topicField];
    var contact = item.responses[contactField];


    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address }, function(results, status) {
      statusDisplay('Google geocoding status for < ' + event_name + ' > : ' + status);
      if (status == 'OK') {
        var lat = results[0].geometry.location.lat();
        var lng = results[0].geometry.location.lng();

        var data = {
          'action': 'map_ajax',
          'map_id': map_id,
          'venue_name': venue_name,
          'venue_address': venue_address,
          'venue_city': venue_city,
          'venue_region': venue_region,
          'venue_country': venue_country,
          'lat': lat,
          'lng': lng,
          'event_name': event_name,
          'event_desc': event_desc,
          'event_date': event_date,
          'event_time': event_time,
          'event_duration': event_duration,
          'event_topic': event_topic,
          'contact': contact
        };

        statusDisplay('Saving...');
        populateSQLTable(data);
      }
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
      data: data,
      statusCode: {
        200: function () {
          statusDisplay('< ' + data.event_name + ' > Status: 200 - Successfully saved');
        }
      },
      error: function(err) {
        statusDisplay('< ' + data.event_name + ' > Status: Error ' + err.status + ' - ' + err.statusText)
      }
    }
  );
}
