import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';

import './Logger.scss';
import Toggle from '../Toggle/Toggle';

const Logger = ( { className, id, log } ) => {
  const [visible, setVisible] = useState( true );

  useEffect( () => {
    const element = document.getElementById( id );
    if ( element ) {
      element.scrollTop = element.scrollHeight;
    }
  }, [log] );

  return (
    <div className={ className }>
      <div className="iip-map-admin-events-toggle">
        <p className="iip-map-admin-events-toggle-label">Log</p>
        <Toggle toggled callback={ setVisible } />
      </div>
      { visible && (
        <pre id={ id }>
            { log.map( line => `${line}\n` ) }
        </pre>
      ) }
    </div>
  );
};

Logger.propTypes = {
  log: PropTypes.arrayOf( PropTypes.string ),
  className: PropTypes.string,
  id: PropTypes.string
};

export const logMessage = ( item = null, logsRef ) => {
  if ( !item ) {
    logsRef.current = [];
    return logsRef.current;
  }
  let str = null;
  if ( typeof item === 'string' ) {
    str = item;
  } else if ( Array.isArray( item ) ) {
    str = item.join( '\n' );
  } else {
    str = JSON.stringify( item, null, 2 );
  }
  if ( str ) {
    const d = new Date().toLocaleString( 'en-us', {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
    } );
    logsRef.current.push( `${d} | ${str}` );
    return [...logsRef.current];
  }
};

export default Logger;
