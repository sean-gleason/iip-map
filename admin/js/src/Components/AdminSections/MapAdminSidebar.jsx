import React from 'react';

import DataExporter from '../Metaboxes/DataExporter';
import UpdateMarker from '../Metaboxes/UpdateMarker';

const MapAdminSidebar = () => (
  <div className="iip-map-admin-column-side">
    <UpdateMarker />
    <DataExporter />
  </div>
);

export default MapAdminSidebar;
