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
      { visible && log && log.length > 0 && (
        <pre id={ id }>
            { log.map( line => `${line}\r\n` ) }
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

export default Logger;
