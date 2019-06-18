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
