// Iterates throug an array of objects extracting their name
// and returning a string of all the names properties
export const collapseArr = ( arr ) => {
  const nameArr = [];

  arr.forEach( ( el ) => {
    const n = el.name;
    nameArr.push( n );
    return nameArr;
  } );

  const collaped = nameArr.join( ', ' );
  return collaped;
};
