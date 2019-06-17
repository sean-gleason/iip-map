import React from 'react';

import ConfigureMap from '../../Containers/ConfigureMap';

import screendoorProject from '../../utils/ScreendoorProject';
import MapEvents from '../Metaboxes/MapEvents';

const MapAdminMain = () => (
  <div className="iip-map-admin-column-wide">
    <ConfigureMap />
    <MapEvents project={ screendoorProject } />
  </div>
);

export default MapAdminMain;
