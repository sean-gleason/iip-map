import axios from 'axios';
import { getMapGlobalMeta } from './globals';

const SCREENDOOR_URL = 'https://screendoor.dobt.co/api/projects/';

// Set Screendoor API endpoint
export const getEndpoint = ( projectId, apiKey, type ) => {
  // type can be: form, statuses, responses
  const screendoorEndpoint = `${SCREENDOOR_URL}${projectId}`;
  const screendoorKey = `&v=0&api_key=${apiKey}`;
  return `${screendoorEndpoint}/${type}?${screendoorKey}`;
};

const request = ( projectId, apiKey, type, params = {} ) => axios.get( `${SCREENDOOR_URL}${projectId}/${type}`, {
  params: { v: 0, api_key: apiKey, ...params },
  timeout: 5000
} ).then( resp => resp.data );

export const getEvents = ( projectId, apiKey ) => request( projectId, apiKey, 'responses', { per_page: 1 } );

// Add Screendoor objects to an array
export const getData = ( response ) => {
  const formData = response.field_data;
  const fields = [];

  formData.forEach( ( element ) => {
    const { label } = element;
    const { id } = element;
    // eslint-disable-next-line camelcase
    const { field_type } = element;
    const fieldObj = { field: id, name: label, fieldType: field_type };

    fields.push( fieldObj );
  } );

  return fields;
};

export const getFields = ( projectId, apiKey ) => request( projectId, apiKey, 'form' ).then( getData );

// Identify button to get Screendoor data
// const getFieldsBtn = document.getElementById('iip-map-get-fields');
// getFieldsBtn.addEventListener('click', getScreendoorMeta);

// function getScreendoorMeta() {
//   getScreendoorFields();
//   getStatuses();
// }

// Get Screendoor field ids and labels
export const getScreendoorFields = ( projectId, apiKey ) => {
  const formEndpoint = getEndpoint( projectId, apiKey, 'form' );

  // Make request to Screendoor API
  const formXHR = new XMLHttpRequest();
  formXHR.open( 'GET', formEndpoint );
  formXHR.responseType = 'json';
  formXHR.send();

  formXHR.onload = function setResponses() {
    const formData = formXHR.response.field_data;
    // const formStatus = formXHR.statusText;

    const fields = [];

    formData.forEach( ( element ) => {
      const { label } = element;
      const { id } = element;
      const fieldObj = { name: label, field: id };

      fields.push( fieldObj );
    } );

    // console.log(fields);
    return fields;

  //   populateScreendoorFields( formData.field_data );
  };
};

// Converts an JS object into a FormData object for use in AJAX calls
// If original object has nested properties, it renders them as a string
export const getFormData = ( obj ) => {
  const formData = new FormData();

  function checkIfString( item ) {
    if ( typeof item === 'string' ) {
      return item;
    }
    return JSON.stringify( item );
  }

  Object.keys( obj ).forEach( key => formData.append( key, checkIfString( obj[key] ) ) );
  return formData;
};

// Save Screendoor field id values
export const saveScreendoorFields = ( dataObj ) => {
  // Get WP admin AJAX URL and data
  const url = getMapGlobalMeta.ajaxUrl;

  // Create the form that constitutes the AJAX request body
  const formData = getFormData( dataObj );
  formData.append( 'action', 'save_screendoor_ajax' );
  formData.append( 'security', getMapGlobalMeta.screendoorNonce );

  // AJAX POST request to save screendoor project data
  return fetch( url, {
    method: 'post',
    body: formData
  } )
    .then( response => response.json() );
};

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
