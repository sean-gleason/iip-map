import React from 'react';

import DataExporter from '../Components/Metaboxes/DataExporter';
import UpdateMarker from '../Components/Metaboxes/UpdateMarker';

const MapAdminSidebar = () => (
  <div className="iip-map-admin-column-side">
    <UpdateMarker />
    <DataExporter />
  </div>
);

export default MapAdminSidebar;
