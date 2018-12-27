import React from 'react';

import ConfigureMap from '../Components/Metaboxes/ConfigureMap';
import FormMapper from './FormMapper';
import DataExporter from '../Components/Metaboxes/DataExporter';
import Geocoder from '../Components/Metaboxes/Geocoder';
import UpdateMarker from '../Components/Metaboxes/UpdateMarker';

const MapAdminPage = () => (
  <div className="iip-map-admin-metabox-holder metabox-holder columns-2">
    <div className="iip-map-admin-column-wide postbox-container">
      <div className="meta-box-sortables ui-sortable">
        <FormMapper />
        <ConfigureMap />
        <Geocoder />
      </div>
    </div>
    <div className="iip-map-admin-column-side postbox-container">
      <UpdateMarker />
      <DataExporter />
    </div>
  </div>
);

export default MapAdminPage;
