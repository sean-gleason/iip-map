import React from 'react';

import FormMapper from './FormMapper';
import DataExporter from '../components/Metaboxes/DataExporter';
import Geocoder from '../components/Metaboxes/Geocoder';
import ShortcodeGenerator from '../components/Metaboxes/ShortcodeGenerator';
import UpdateMarker from '../components/Metaboxes/UpdateMarker';

const MapAdminPage = () => (
  <div className="iip-map-admin-metabox-holder metabox-holder columns-2">
    <div className="iip-map-admin-column-side postbox-container">
      <ShortcodeGenerator />
      <UpdateMarker />
      <DataExporter />
    </div>
    <div className="iip-map-admin-column-wide postbox-container">
      <div className="meta-box-sortables ui-sortable">
        <FormMapper />
        <Geocoder />
      </div>
    </div>
  </div>
);

export default MapAdminPage;
