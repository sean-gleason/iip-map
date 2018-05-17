// Set Screendoor API endpoint
let responsesEndpoint = 'https://screendoor.dobt.co/api/projects/' + iip_map_params.screendoor_project + '/responses?per_page=20s&v=0&api_key=' + iip_map_params.screendoor_api_key;

// Get field IDs
let googleKey = iip_map_params.google_api_key;
let mapId = iip_map_params.map_data_id;

let venueField = iip_map_params.venue_field;
let addressField = iip_map_params.address_field;
let cityField = iip_map_params.city_field;
let regionField = iip_map_params.region_field;
let countryField = iip_map_params.country_field;
let eventField = iip_map_params.event_field;
let descField = iip_map_params.desc_field;
let dateField = iip_map_params.date_field;
let timeField = iip_map_params.time_field;
let durationField = iip_map_params.duration_field;
let topicField = iip_map_params.topic_field;
let contactField = iip_map_params.contact_field;

document.addEventListener('DOMContentLoaded', function () {
  const maps_api_js = document.createElement('script');
  maps_api_js.type = 'text/javascript';
  maps_api_js.src = 'https://maps.googleapis.com/maps/api/js?key=' + googleKey;
  document.getElementsByTagName('head')[0].appendChild(maps_api_js);
});

const geocodeBtn = document.getElementById('iip-map-geocode');
geocodeBtn.addEventListener('click', getScreendoorData);

function getScreendoorData() {
  // Make request to Screendoor API
  let request = new XMLHttpRequest();
  request.open('GET', responsesEndpoint);
  request.responseType = 'json';
  request.send();

  request.onload = function() {
    let data = request.response;
    let status = request.statusText

    geocodeAddress(data);
    statusDisplay('Call to Screendoor: ' + status);
  }
}

// Extract event data and geocode event locations to latitude/longitude
function geocodeAddress(jsonObj) {
  jsonObj.forEach(function(item) {

    let venue_address = item.responses[addressField];
    let venue_city = item.responses[cityField];
    let venue_region = item.responses[regionField];
    let venue_country = item.responses[countryField];
    let event_name = item.responses[eventField];

    // Pull out address info and write to a string
    let address = venue_address + ', ' + venue_city + ', ' + venue_country;
    let addressSimplified = venue_city + ', ' + venue_country;
    let data = {};

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address }, function(results, status) {
      statusDisplay('Google geocoding status for < ' + event_name + ' > : ' + status);
      if (status === 'OK') {
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();

        data = {
          'action': 'map_ajax',
          'map_id': mapId,
          'venue_name': item.responses[venueField],
          'venue_address': venue_address,
          'venue_city': venue_city,
          'venue_region': venue_region,
          'venue_country': venue_country,
          'lat': lat,
          'lng': lng,
          'event_name': event_name,
          'event_desc': item.responses[descField],
          'event_date': item.responses[dateField],
          'event_time': item.responses[timeField],
          'event_duration': item.responses[durationField],
          'event_topic': item.responses[topicField],
          'contact': item.responses[contactField]
        };

        statusDisplay('Saving...');
        populateSQLTable(data);
      } else if (status === 'ZERO_RESULTS') {
        // Run geocoder on fallback address if full address fails
        geocoder.geocode( { 'address': addressSimplified }, function(results, status) {
          statusDisplay('Address not valid. Attempting to geocode fallback address for < ' + event_name + ' >');
          if (status === 'OK') {
            let lat = results[0].geometry.location.lat();
            let lng = results[0].geometry.location.lng();

            data = {
              'action': 'map_ajax',
              'map_id': mapId,
              'venue_name': item.responses[venueField],
              'venue_address': venue_address,
              'venue_city': venue_city,
              'venue_region': venue_region,
              'venue_country': venue_country,
              'lat': lat,
              'lng': lng,
              'event_name': event_name,
              'event_desc': item.responses[descField],
              'event_date': item.responses[dateField],
              'event_time': item.responses[timeField],
              'event_duration': item.responses[durationField],
              'event_topic': item.responses[topicField],
              'contact': item.responses[contactField]
            };

            statusDisplay('Saving fallback...');
            populateSQLTable(data);
          } else {
            statusDisplay(status + ': Cannot map this event - < ' + event_name + ' >');
          }
        });
      } else {
        statusDisplay(status + ': Cannot map this event - < ' + event_name + ' >');
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
        statusDisplay('< ' + data.event_name + ' > Status: Error ' + err.status + ' - ' + err.statusText + '. Could not save.')
      }
    }
  );
}

// Report out status
function statusDisplay(status) {
  if (typeof status !== 'string') {
    throw new Error('statusDisplay(): argument must be a string');
  }
  $('#geocoder-return').append(status + `<br />`);
}
