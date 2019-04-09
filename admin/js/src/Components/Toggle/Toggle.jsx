import React, { useState } from 'react';
import { bool, func } from 'prop-types';

import './Toggle.css';

const Toggle = ( { callback, checked } ) => {
  const initialVal = checked ? 'checked' : 'unchecked';
  const [toggleState, setToggleState] = useState( initialVal );

  const toggle = () => {
    setToggleState( toggleState === 'unchecked' ? 'checked' : 'unchecked' );
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
  checked: bool,
  callback: func
};

export default Toggle;
