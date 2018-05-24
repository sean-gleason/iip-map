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

let onBatch = 0;
let dataArray = [];
let responsesArray = [];

// Load Google Maps API script (needed for geocoding)
document.addEventListener('DOMContentLoaded', function () {
  const maps_api_js = document.createElement('script');
  maps_api_js.type = 'text/javascript';
  maps_api_js.src = 'https://maps.googleapis.com/maps/api/js?key=' + googleKey;
  document.getElementsByTagName('head')[0].appendChild(maps_api_js);
});

const geocodeBtn = document.getElementById('iip-map-geocode');
geocodeBtn.addEventListener('click', getScreendoorData);

function getScreendoorData() {
  // Set Screendoor API endpoint
  let responsesEndpoint = screendoorEndpoint + '/responses?per_page=10&status=' + iip_map_params.trigger_status + screendoorKey;

  // Make request to Screendoor API
  let request = new XMLHttpRequest();
  request.open('GET', responsesEndpoint);
  request.responseType = 'json';
  request.send();

  request.onload = function() {
    let data = request.response;
    let status = request.statusText

    statusDisplay('Call to Screendoor API: ' + status);
    geocodeAddress(data);
  }
}

// Extract event data and geocode event locations to latitude/longitude
function geocodeAddress(jsonObj) {

  let screendoorItems = jsonObj.length;
  statusDisplay('Returned <b>' + screendoorItems + ' results</b> with status ' + iip_map_params.trigger_status)

  // Set batching for geocoding and database writes
  let interval = 1000; // Interval between Ajax calls (in milliseconds)
  let promise = Promise.resolve();

  const batchSize = 20;
  let batchNumber = Math.floor(screendoorItems / batchSize);
  let batchRemainder = screendoorItems % batchSize;

  // Geocode each Screendoor entry
  jsonObj.forEach( function(item) {
    promise = promise.then(function () {

      let venue_address = item.responses[addressField];
      let venue_city = item.responses[cityField];
      let venue_region = item.responses[regionField];
      let venue_country = item.responses[countryField];
      let event_name = item.responses[eventField];
      let responseId = item.id;

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

          statusDisplay('Queuing results...');
          batchResponses(data, responseId, batchSize, batchNumber, batchRemainder);
        } else if (status === 'ZERO_RESULTS') {
          // Run geocoder on fallback address if full address fails
          geocoder.geocode( { 'address': addressSimplified }, function(results, status) {
            statusDisplay('Address not valid. Attempting to geocode fallback address for < ' + event_name + ' >');
            if (status === 'OK') {
              let lat = results[0].geometry.location.lat();
              let lng = results[0].geometry.location.lng();

              data = {
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

              statusDisplay('Queuing fallback results...');
              batchResponses(data, responseId, batchSize, batchNumber, batchRemainder);
            } else {
              statusDisplay(status + ': Cannot map this event - < ' + event_name + ' >');
            }
          });
        } else {
          statusDisplay(status + ': Cannot map this event - < ' + event_name + ' >');
        }
      });

      // Geocoding interals (to avoid hitting per second query limit)
      return new Promise(function (resolve) {
        setTimeout(resolve, interval);
      });

    });
  });
}

// Batch results into groups for writing to the DB (to reduce the number of Ajax calls)
function batchResponses(data, responseId, batchSize, batchNumber, batchRemainder) {

  if (onBatch < batchNumber) {

    dataArray.push(data);
    responsesArray.push(responseId);

    if (dataArray.length === batchSize) {
      statusDisplay('<b>SAVING ' + batchSize + ' results...</b>');
      populateSQLTable(dataArray,responsesArray);

      dataArray = [];
      responsesArray = [];
      onBatch++;
    }
  // Handle the remainder if number of responses not divisible by batch size
  } else {

    dataArray.push(data);
    responsesArray.push(responseId);

    if (dataArray.length === batchRemainder) {
      statusDisplay('<b>SAVING ' + batchRemainder + ' results...</b>');
      populateSQLTable(dataArray, responsesArray);

      dataArray = [];
      responsesArray = [];
      onBatch = 0;
    }
  }
}

// Write event information to the database
function populateSQLTable(data, responses) {
  let updateNumber = responses.length;

  jQuery.ajax(
    {
      type: 'post',
      dataType: 'json',
      url: iip_map_params.ajax_url,
      data: {'action': 'map_ajax', data},
      statusCode: {
        200: function () {
          statusDisplay('Status 200: <b>' + data.length + ' events successfully saved</b>: < ' + data.map(a => a.event_name).join(', ') + ' >');
          statusDisplay('Updating Screendoor statuses...');
          updateScreendoorStatus(responses, updateNumber);
        }
      },
      error: function(err) {
        statusDisplay('Status: <b>Error ' + err.status + '</b> - ' + err.statusText + '. Could not save. '  + data.length + ' events: < ' + data.map(a => a.event_name).join(', ') + ' >')
      }
    }
  );
}

// Update the Screendoor status for a response to complete once saved
function updateScreendoorStatus(responses, updateNumber) {

  let finalStatus = iip_map_params.complete_status;
  let statusCount = 0;
  let loopNumber = 0;

  responses.forEach( function(item) {
    let singleResponseEndpoint = screendoorEndpoint + '/responses/' + item + '?' + screendoorKey;

    jQuery.ajax(
      {
        type: 'put',
        dataType: 'json',
        url: singleResponseEndpoint,
        data: { 'status': finalStatus },
        statusCode: {
          200: function () {
            statusCount++;
            loopNumber++;
            if (loopNumber === updateNumber) {
              reportStatusResults(statusCount, finalStatus);
              loopNumber = 0;
            }
          }
        },
        error: function(err) {
          statusDisplay('<b>ERROR ' + err.status + '</b> - ' + err.statusText + '. Could not update Screendoor status for response #'  + item);
          loopNumber++;
          if (loopNumber === updateNumber) {
            reportStatusResults(statusCount, finalStatus);
            loopNumber = 0;
          }
        }
      }
    );

  });

}

//
function reportStatusResults(statusCount, finalStatus) {
  statusDisplay('Successfully updated ' + statusCount + ' Screendoor responses to status < ' + finalStatus + ' >');
}

// Report out status to the on-page log
function statusDisplay(status) {
  if (typeof status !== 'string') {
    throw new Error('statusDisplay(): argument must be a string');
  }
  $('#geocoder-return').append(status + `<br />`);
}
