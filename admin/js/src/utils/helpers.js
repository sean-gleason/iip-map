import axios from 'axios';
import { getMapMeta, getMapGlobalMeta } from './globals';

// Iterates throug an array of objects extracting their name
// and returning a string of all the names properties
export const collapseArr = ( arr ) => {
  const nameArr = [];

  if ( arr && Array.isArray( arr ) ) {
    arr.forEach( ( el ) => {
      const n = el.name;
      nameArr.push( n );
    } );
  } else {
    console.warn( 'arr is not an array', arr );
  }

  return nameArr.join( ', ' );
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

export const getObjectFromArray = ( data, key = 'field' ) => data.reduce( ( obj, item ) => {
  obj[item[key]] = { ...item };
  return obj;
}, {} );

export const getMarker = ( args ) => {
  // Get WP admin AJAX URL and data
  const url = getMapGlobalMeta.ajaxUrl;

  // Create the form that constitutes the AJAX request body
  const formData = getFormData( { id: args, post_id: getMapMeta.id } );
  formData.append( 'action', 'iip_map_get_marker_ajax' );
  formData.append( 'security', getMapGlobalMeta.markerNonce );

  // AJAX POST request to save screendoor project data
  return axios.post( url, formData ).then( resp => resp.data );
};

export const updateMarker = ( args ) => {
  // Get WP admin AJAX URL and data
  const url = getMapGlobalMeta.ajaxUrl;

  // Create the form that constitutes the AJAX request body
  const formData = getFormData( { ...args } );
  formData.append( 'action', 'iip_map_update_marker_ajax' );
  formData.append( 'security', getMapGlobalMeta.markerNonce );

  // AJAX POST request to save screendoor project data
  return axios.post( url, formData ).then( resp => resp.data );
};

export const deleteMarker = ( args ) => {
  // Get WP admin AJAX URL and data
  const url = getMapGlobalMeta.ajaxUrl;

  // Create the form that constitutes the AJAX request body
  const formData = getFormData( { id: args } );
  formData.append( 'action', 'iip_map_delete_marker_ajax' );
  formData.append( 'security', getMapGlobalMeta.markerNonce );

  // AJAX POST request to save screendoor project data
  return axios.post( url, formData ).then( resp => resp.data );
};
