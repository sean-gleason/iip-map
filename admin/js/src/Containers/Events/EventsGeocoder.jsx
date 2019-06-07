import React from 'react';
import * as PropTypes from 'prop-types';
import { getMapEvents } from '../../utils/globals';

const EventsGeocoder = ( { project } ) => {
  const handleGeocode = () => {
    project.geocode()
      .then( result => console.log( result ) );
  };

  return (
    <div className="iip-admin-map-events-geocoder">
      <h2>Geocoder</h2>
      <div className="iip-map-admin-events-container">
        <div className="iip-map-admin-events-header">
          <div className="iip-map-admin-events-downloader__info">
            <span>
              <b>Geocoded Events: </b>
              { `${getMapEvents.geoEvents} / ${getMapEvents.events}` }
            </span>
          </div>
          <div className="iip-map-admin-events-downloader__download">
            <button className="button button-large" type="button" onClick={ handleGeocode }>
              Geocode Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

EventsGeocoder.propTypes = {
  project: PropTypes.shape( {
    geocode: PropTypes.func
  } )
};

export default EventsGeocoder;
