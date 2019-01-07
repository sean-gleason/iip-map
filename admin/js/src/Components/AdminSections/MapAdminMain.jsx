import React from 'react';

import ConfigureMap from '../../Containers/ConfigureMap';
import FormMapper from '../../Containers/FormMapper';
import Geocoder from '../Metaboxes/Geocoder';

const MapAdminMain = () => (
  <div className="iip-map-admin-column-wide">
    <ConfigureMap />
    <FormMapper />
    <Geocoder />
  </div>
);

export default MapAdminMain;
