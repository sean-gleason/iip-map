import React, { useState, useReducer } from 'react';

import { getMarker, updateMarker, deleteMarker } from '../../utils/helpers';

import './UpdateMarker.scss';

const UpdateMarker = () => {
  const [id, setId] = useState( '1600009' );
  const [event, setEvent] = useReducer( ( prevState, update ) => ( { ...prevState, ...update } ), {
    data: null,
    loading: false,
    error: ''
  } );

  const [action, setAction] = useReducer( ( prevState, update ) => ( { ...prevState, ...update } ), {
    loading: false,
    error: false,
    message: ''
  } );
  const setActionLoading = () => setAction( { loading: true, message: '' } );
  const setActionError = err => setAction( { loading: false, error: true, message: err } );
  const setActionResult = err => setAction( { loading: false, error: false, message: err } );
  const setFindError = ( err ) => {
    setEvent( { loading: false, error: err } );
    setAction( { message: '' } );
  };

  const setEventData = eventData => setEvent( { ...event, data: { ...event.data, ...eventData } } );

  const handleChange = field => e => setEventData( { [field]: e.target.value } );

  const handleFind = () => {
    setEvent( { loading: true, data: null, error: '' } );
    getMarker( id )
      .then( ( result ) => {
        if ( result.success ) {
          if ( result.event ) {
            setEvent( { loading: false, data: result.event } );
            setAction( { message: '' } );
          } else {
            setFindError( 'Marker not found.' );
          }
        } else if ( result.error ) {
          setFindError( result.error );
        } else {
          setFindError( 'Error retrieving marker.' );
        }
      } )
      .catch( setFindError );
  };

  const handleUpdate = () => {
    setActionLoading();
    updateMarker( event.data )
      .then( ( result ) => {
        if ( result.success ) {
          if ( result.result ) {
            setActionResult( 'Marker updated.' );
          } else {
            setActionResult( 'No changes were made to the marker.' );
          }
        } else if ( result.error ) {
          setActionError( result.error );
        } else {
          setActionError( 'Error updating marker.' );
        }
      } )
      .catch( setActionError );
  };

  const handleDelete = () => {
    setActionLoading();
    deleteMarker( event.data.id )
      .then( ( result ) => {
        if ( result.success && result.result ) {
          setActionResult( 'Marker deleted.' );
          setEvent( { loading: false, data: null, error: '' } );
        } else if ( result.error ) {
          setActionError( result.error );
        } else {
          setActionError( 'Error deleting marker.' );
        }
      } )
      .catch( setActionError );
  };

  const onKeyDown = ( e ) => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if ( e.key === 'Enter' ) {
      e.preventDefault();
      e.stopPropagation();
      if ( e.target.id === 'iip-map-event-id' ) {
        handleFind();
      }
    }
  };

  return (
    <div className="iip-map-admin-column-side">
      <div className="iip-map-admin-small-metabox">
        <div className="iip-map-admin-update-marker-box" id="map-update-marker-box">
          { /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */ }
          <form className="iip-map-admin-form" onKeyDown={ onKeyDown }>
            <div className="iip-map-admin-marker-row">
              <p className="iip-map-admin-marker-text">
                Enter the
                { (
                  <b> Screendoor ID </b>
                ) }
                of the event you would like to update:
              </p>
              <input
                id="iip-map-event-id"
                type="text"
                className="map-update-marker-input"
                name="_iip_map_event_id"
                value={ id }
                onChange={ e => setId( e.target.value ) }
              />
            </div>
            <div className="iip-map-admin-marker-row iip-map-admin-marker-find">
              <div className="map-admin-spinner" style={ { visibility: event.loading ? 'visible' : 'hidden' } } />
              <button
                className="button button-primary button-large map-update-marker-button"
                id="iip-map-find-event"
                type="button"
                name="find-event"
                disabled={ event.loading }
                onClick={ handleFind }
              >
                Find Event
              </button>
              <div className="map-admin-clearfix" />
            </div>
            { event.error && (
              <div className="iip-map-admin-marker-row">
                <div className="iip-map-admin-marker-error">
                  { event.error }
                </div>
              </div>
            ) }
            { !event.loading && event.data !== null && (
              <div className="iip-map-admin-marker-container">
                <div className="iip-map-admin-marker-row">
                  <label className="iip-map-admin-marker-label" htmlFor="iip-map-event-name">
                    Event Name:
                  </label>
                  <input
                    id="iip-map-event-name"
                    type="text"
                    className="iip-map-admin-marker-input"
                    name="_iip_map_event_name"
                    value={ event.data.title }
                    onChange={ handleChange( 'title' ) }
                  />
                </div>

                <div className="iip-map-admin-marker-row">
                  <label className="iip-map-admin-marker-label" htmlFor="iip-map-event-lat">
                    Latitude:
                  </label>
                  <input
                    id="iip-map-event-lat"
                    type="text"
                    className="iip-map-admin-marker-input"
                    name="_iip_map_event_lat"
                    value={ event.data.lat }
                    onChange={ handleChange( 'lat' ) }
                  />
                </div>

                <div className="iip-map-admin-marker-row">
                  <label className="iip-map-admin-marker-label" htmlFor="iip-map-event-lng">
                    Longitude:
                  </label>
                  <input
                    id="iip-map-event-lng"
                    type="text"
                    className="iip-map-admin-marker-input"
                    name="_iip_map_event_lng"
                    value={ event.data.lng }
                    onChange={ handleChange( 'lng' ) }
                  />
                </div>

                <div className="iip-map-admin-button-row">
                  <button
                    className="button button-medium"
                    id="iip-map-update-marker"
                    type="button"
                    name="update-marker"
                    disabled={ action.loading }
                    onClick={ handleUpdate }
                  >
                    Update Marker
                  </button>
                  <button
                    className="button button-medium"
                    id="iip-map-delete-marker"
                    type="button"
                    name="delete-marker"
                    disabled={ action.loading }
                    onClick={ handleDelete }
                  >
                    Delete Marker
                  </button>
                </div>
              </div>
            ) }

            <div className="iip-map-admin-marker-row">
              { action.message && (
                <div className={ `iip-map-admin-marker-${action.error ? 'error' : 'success'}` }>
                  { action.message }
                </div>
              ) }
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateMarker;
