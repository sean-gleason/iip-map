import React from 'react';
import { bool, element, string } from 'prop-types';

import Toggle from '../Toggle/Toggle';

const ConfigsToggle = ( { checked, children, label } ) => (
  <div className="iip-map-admin-card-preview-option">
    <div className="iip-map-admin-card-preview-option-top">
      <p className="iip-map-admin-card-preview-toggle-label">{ label }</p>
      <Toggle checked={ checked } />
    </div>
    { children }
  </div>
);

ConfigsToggle.propTypes = {
  checked: bool,
  children: element,
  label: string
};

export default ConfigsToggle;
