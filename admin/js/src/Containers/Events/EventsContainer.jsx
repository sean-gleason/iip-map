import React, { Fragment } from 'react';
import { MapContext } from '../../Components/AdminSections/MapAdminMain';
import EventsDownloader from './EventsDownloader';
import EventsGeocoder from './EventsGeocoder';

import './EventsContainer.scss';

const EventsContainer = () => (
  <div className="iip-map-admin-events">
    <div className="iip-map-admin-events-modal">
      <MapContext.Consumer>
        { ( { project, updated } ) => (
          <Fragment>
            <EventsDownloader project={ project } updated={ updated } />
            <EventsGeocoder project={ project } />
          </Fragment>
        ) }
      </MapContext.Consumer>
    </div>
  </div>
);

export default EventsContainer;
