import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';

import Toggle from '../Toggle/Toggle';

const ConfigsToggle = ( {
  toggled, children, label, callback
} ) => {
  const [toggle, setToggle] = useState( toggled );

  const handleChange = ( toggleState ) => {
    setToggle( toggleState );
    callback( toggleState );
  };

  useEffect( () => {
    setToggle( toggled );
  }, [toggled] );

  return (
    <div className="iip-map-admin-card-preview-option">
      <div className="iip-map-admin-card-preview-option-top">
        <p className="iip-map-admin-card-preview-toggle-label">{ label }</p>
        <Toggle toggled={ toggle } callback={ handleChange } />
      </div>
      { toggle && children && (
        <div className="iip-map-admin-card-preview-meta">
          { children }
        </div>
      ) }
    </div>
  );
};

ConfigsToggle.propTypes = {
  children: PropTypes.element,
  label: PropTypes.string,
  toggled: PropTypes.bool,
  callback: PropTypes.func
};

ConfigsToggle.defaultProps = {
  callback: () => {}
};

export default ConfigsToggle;
