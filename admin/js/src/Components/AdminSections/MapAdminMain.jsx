import React from 'react';

import ConfigureMapContainer from '../../Containers/ConfigureMap/ConfigureMapContainer';

import screendoorProject from '../../utils/ScreendoorProject';
import MapEvents from '../Metaboxes/MapEvents';

const MapAdminMain = () => (
  <div className="iip-map-admin-column-wide">
    <ConfigureMapContainer />
    <MapEvents project={ screendoorProject } />
  </div>
);

export default MapAdminMain;
