import React from 'react';

const UpdateMarker = ( ) => (
  <div className="iip-map-admin-small-metabox postbox">
    <h2 className="iip-map-admin-metabox-header">Update/Delete Marker</h2>
    <div className="inside">
      <div className="iip-map-admin-update-marker-box" id="map-update-marker-box">
        <form className="iip-map-admin-form">

          <div className="iip-map-admin-marker-row">
            <p className="iip-map-admin-marker-text">
              Enter the id of the event you would like to update:
            </p>
            <input
              id="iip-map-event-id"
              type="text"
              className="map-update-marker-input"
              name="_iip_map_event_id"
            />
            <div id="map-update-marker-spinner" className="map-admin-spinner" />
          </div>

          <div className="iip-map-admin-marker-container map-admin-hidden">
            <div className="iip-map-admin-marker-row">
              <label className="iip-map-admin-marker-label" htmlFor="_iip_map_event_name">
                Event Name:
                <input
                  id="iip-map-event-name"
                  type="text"
                  className="iip-map-admin-marker-input"
                  name="_iip_map_event_name"
                  value=""
                />
              </label>
            </div>

            <div className="iip-map-admin-marker-row">
              <label className="iip-map-admin-marker-label" htmlFor="_iip_map_event_lat">
                Latitude:
                <input
                  id="iip-map-event-lat"
                  type="text"
                  className="iip-map-admin-marker-input"
                  name="_iip_map_event_lat"
                  value=""
                />
              </label>
            </div>

            <div className="iip-map-admin-marker-row">
              <label className="iip-map-admin-marker-label" htmlFor="_iip_map_event_lng">
                Longitude:
                <input
                  id="iip-map-event-lng"
                  type="text"
                  className="iip-map-admin-marker-input"
                  name="_iip_map_event_lng"
                  value=""
                />
              </label>
            </div>

            <div className="iip-map-admin-button-row">
              <button className="button button-medium" id="iip-map-update-marker" type="button" name="update-marker">
                Update Marker
              </button>
              <button className="button button-medium" id="iip-map-delete-marker" type="button" name="delete-marker">
                Delete Marker
              </button>
            </div>
          </div>

          <div className="map-admin-clearfix">
            <button
              className="button button-primary button-large map-update-marker-button"
              id="iip-map-find-event"
              type="button"
              name="find-event"
            >
              Find Event
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
);

export default UpdateMarker;
