import React from 'react';
import * as PropTypes from 'prop-types';

import MapEventsContainer from '../../Containers/MapEvents/MapEventsContainer';

const MapEvents = ( { project } ) => (
  <div className="postbox">
    <h2 className="iip-map-admin-metabox-header">Map Input Fields</h2>
    <div className="inside">
      <h4 className="iip-map-admin-metabox-subheader">
        Use this form to map the form values from Sceendoor.
      </h4>
      <MapEventsContainer project={ project } />
    </div>
  </div>
);

MapEvents.propTypes = {
  project: PropTypes.object
};

export default MapEvents;
