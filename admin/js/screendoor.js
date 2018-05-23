// Set Screendoor API endpoint
let screendoorEndpoint = 'https://screendoor.dobt.co/api/projects/' + screendoor_params.screendoor_project;
const screendoorKey = '?&v=0&api_key=' + screendoor_params.screendoor_api_key;

const getFieldsBtn = document.getElementById('iip-map-get-fields');
getFieldsBtn.addEventListener('click', getStatuses);

// function getScreendoorFields() {
//   let formEndpoint = screendoorEndpoint + '/form' + screendoorKey;
//   // Make request to Screendoor API
//   let formXHR = new XMLHttpRequest();
//   formXHR.open('GET', formEndpoint);
//   formXHR.responseType = 'json';
//   formXHR.send();
//
//   formXHR.onload = function() {
//     let formData = formXHR.response.field_data;
//     let formStatus = formXHR.statusText
//   }
//
// }
//
// function getFieldInfo(jsonObj) {
//   jsonObj.forEach(function(item) {
//     let label = item.label;
//     let id = item.id;
//
//     console.log(label + " " + id);
//   });
// }

function getStatuses() {
  let statusEndpoint = screendoorEndpoint + '/statuses' + screendoorKey;
  // Make request to Screendoor API
  let statusXHR = new XMLHttpRequest();
  statusXHR.open('GET', statusEndpoint);
  statusXHR.responseType = 'json';
  statusXHR.send();

  statusXHR.onload = function() {
    let statusData = statusXHR.response;
    let statusStatus = statusXHR.statusText

    populateStatuses(statusData);
  }
}

function populateStatuses(data) {
  let triggerStatusSelect = document.getElementById('iip-map-geocoder-trigger');
  let completeStatusSelect = document.getElementById('iip-map-geocoder-complete');
  let options = [];

   options.push( "<option>- Select -</option>" );
   data.forEach( function(item) {
      options.push( "<option id='" + item.name + "' value='" + item.name + "'>" + item.name + "</option>" );
  });

  let optionsList = options.join('');
  triggerStatusSelect.innerHTML += optionsList;
  completeStatusSelect.innerHTML += optionsList;
}

// function getStatuses(jsonObj) {
//   let projTest = screendoor_params.screendoor_project;
//
//   let tests = populateStatuses( projTest, jsonObj );
//
//   setFieldValue( $('#iip-map-geocoder-trigger select'), tests);
  // let dataArray = [];
  //
  // jsonObj.forEach(function(item) {
  //
  //   let statusName = {};
  //
  //   statusName = {
  //     'status': item.name
  //   };
  //
  //   dataArray.push(statusName);
  // });
  //
  // postStatuses(dataArray);

// }
//
// function postStatuses(data) {
//   let projectId = screendoor_params.screendoor_project;
//
//   jQuery.ajax(
//     {
//       type: 'post',
//       dataType: 'json',
//       url: screendoor_params.ajax_url,
//       data: {'action': 'screendoor_status_ajax', projectId, data},
//     }
//   );
// }
//
// function setFieldValue( $el,  value ) {
//   if ( value ) {
//     $el.val( value ).trigger( 'change' );
//   }
// }
//
// function populateStatuses( projId, data ) {
//   var options = [], id,
//     values = [], value;
//
//   options.push( "<option>- Select -</option>" );
//   $.each( data, function() {
//     options.push( "<option id='" + this.name + "' value='" + this.name + "'>" + this.name + "</option>" );
//     values.push (this.name );
//   });
//
//   $('#iip-map-geocoder-trigger select').html( options.join('') );
//   $('#sd_statuses_complete select').html( options.join('') );
//
//   return values;
// }
