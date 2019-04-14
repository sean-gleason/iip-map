import React, { useEffect, useState } from 'react';
import { bool, func } from 'prop-types';

import './Toggle.css';

const Toggle = ( { callback, toggled } ) => {
  const [toggleState, setToggleState] = useState( null );

  useEffect( () => {
    const initialVal = toggled ? 'toggled' : 'untoggled';
    setToggleState( initialVal );
  }, [toggled] );

  const toggle = () => {
    setToggleState( toggleState === 'untoggled' ? 'toggled' : 'untoggled' );
    callback();
  };

  return (
    <div
      className={ `iip-map-admin-toggle toggle-${toggleState}` }
      onClick={ toggle }
      onKeyPress={ toggle }
      role="button"
      tabIndex="0"
    >
      <div className="iip-map-admin-toggle-track" />
      <div className="iip-map-admin-toggle-handle" />
    </div>
  );
};

Toggle.propTypes = {
  toggled: bool,
  callback: func
};

Toggle.defaultProps = {
  callback: () => {}
};

export default Toggle;
