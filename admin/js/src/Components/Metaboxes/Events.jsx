import React from 'react';
import EventsContainer from '../../Containers/Events/EventsContainer';

const Events = ( ) => (
  <div className="postbox">
    <h2 className="iip-map-admin-metabox-header">Events</h2>
    <div className="inside">
      <p>
        Here you can download events from Screendoor based on the mapping above.
        <br />
        Once the events are downloaded, you can run the Geocoder to populate map coordinates for each event.
      </p>
      <EventsContainer />
    </div>
  </div>
);

export default Events;
