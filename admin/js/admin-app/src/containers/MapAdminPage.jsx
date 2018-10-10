import React from 'react';

import ConfigureMap from '../components/Metaboxes/ConfigureMap';
import FormMapper from './FormMapper';
import DataExporter from '../components/Metaboxes/DataExporter';
import Geocoder from '../components/Metaboxes/Geocoder';
import UpdateMarker from '../components/Metaboxes/UpdateMarker';

const MapAdminPage = () => (
  <div className="iip-map-admin-metabox-holder metabox-holder columns-2">
    <div className="iip-map-admin-column-side postbox-container">
      <UpdateMarker />
      <DataExporter />
    </div>
    <div className="iip-map-admin-column-wide postbox-container">
      <div className="meta-box-sortables ui-sortable">
        <FormMapper />
        <ConfigureMap />
        <Geocoder />
      </div>
    </div>
  </div>
);

export default MapAdminPage;
