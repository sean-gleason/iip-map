// Identify button to get Screendoor data
// const getFieldsBtn = document.getElementById('iip-map-get-fields');
// getFieldsBtn.addEventListener('click', getScreendoorMeta);

// function getScreendoorMeta() {
//   getScreendoorFields();
//   getStatuses();
// }


// Get Screendoor statuses
// function getStatuses() {
//   let statusEndpoint = screendoorEndpoint + '/statuses?' + screendoorKey;
//   // Make request to Screendoor API
//   let statusXHR = new XMLHttpRequest();
//   statusXHR.open('GET', statusEndpoint);
//   statusXHR.responseType = 'json';
//   statusXHR.send();

//   statusXHR.onload = function() {
//     let statusData = statusXHR.response;
//     let statusStatus = statusXHR.statusText

//     populateStatuses(statusData);
//   }
// }

// Add Screedoor statuses as dropdown options
// function populateStatuses(data) {
//   let triggerStatusSelect = document.getElementById('iip-map-geocoder-trigger');
//   let completeStatusSelect = document.getElementById('iip-map-geocoder-complete');
//   let statusOptions = [];

//    statusOptions.push( "<option>- Select -</option>" );
//    data.forEach( function(item) {
//       statusOptions.push( "<option id='" + item.name + "' value='" + item.name + "'>" + item.name + "</option>" );
//   });

//   let statusOptionsList = statusOptions.join('');
//   triggerStatusSelect.innerHTML += statusOptionsList;
//   completeStatusSelect.innerHTML += statusOptionsList;
// }
