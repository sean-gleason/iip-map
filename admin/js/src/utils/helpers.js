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
