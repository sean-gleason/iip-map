// Pull Screendoor project id and status settings from admin config
var endpoint = 'https://screendoor.dobt.co/api/projects/' + iip_map_params.screendoor_project + '/responses?v=0&api_key=' + iip_map_params.screendoor_api_key;

// Geocode event locations to latitude/longitude



// var geocoder = new google.maps.Geocoder();
//
// function geocodeAddress(geocoder, resultsMap) {
//   var address = document.getElementById('address').value;
//
//   geocoder.geocode({'address': address}, function(results, status) {
//     if (status === 'OK') {
//       resultsMap.setCenter(results[0].geometry.location);
//         var marker = new google.maps.Marker({
//           map: resultsMap,
//           position: results[0].geometry.location
//         });
//     });
//   }
// }

// Render markers on map
