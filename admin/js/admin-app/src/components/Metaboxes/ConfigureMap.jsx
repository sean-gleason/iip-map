import React from 'react';

import MapBox from './MapBox';
import ShortcodeGenerator from './ShortcodeGenerator';

const ConfigureMap = ( ) => (
  <div className="postbox">
    <h2 className="iip-map-admin-metabox-header hndle ui-sortable-handle">Configure Your Map</h2>
    <div className="inside">
      <div className="iip-map-admin-configure-box">
        <MapBox />
        <ShortcodeGenerator />
      </div>
    </div>
  </div>
);

export default ConfigureMap;
