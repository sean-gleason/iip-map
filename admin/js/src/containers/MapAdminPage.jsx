import React from 'react';

import ConfigureMap from './ConfigureMap';
import DataExporter from '../Components/Metaboxes/DataExporter';
import FormMapper from './FormMapper';
import Geocoder from '../Components/Metaboxes/Geocoder';
import SubmitBox from '../Components/Metaboxes/SubmitBox';
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
      <SubmitBox />
      <UpdateMarker />
      <DataExporter />
    </div>
  </div>
);

export default MapAdminPage;
