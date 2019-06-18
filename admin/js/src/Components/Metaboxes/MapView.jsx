import React from 'react';
import ConfigureMapContainer from '../../Containers/ConfigureMap/ConfigureMapContainer';

const MapView = () => (
  <div className="postbox">
    <h2 className="iip-map-admin-metabox-header">Set Your Map View</h2>
    <div className="inside">
      <ConfigureMapContainer />
    </div>
  </div>
);

export default MapView;
