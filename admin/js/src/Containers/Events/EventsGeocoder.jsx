import React, { useEffect, useRef, useState } from 'react';
import * as PropTypes from 'prop-types';

const ACTIVE = 3;
const STARTING = 2;
const STOPPING = 1;
const INACTIVE = 0;

const EventsGeocoder = ( {
  project, eventCounts, setEventCounts, log
} ) => {
  const [status, setStatus] = useState( null );
  const [active, setActive] = useState( INACTIVE );
  const taskRef = useRef( 0 );

  const doStatus = ( text, running = true ) => {
    const task = taskRef.current;
    if ( task ) {
      clearTimeout( task );
      taskRef.current = 0;
    }
    const dots = [];
    const update = () => {
      setStatus( `${text}${dots.join( '' )}` );
      dots.push( '.' );
      if ( running ) {
        taskRef.current = setTimeout( update, 750 );
      }
    };
    update();
  };

  const geocoderRef = useRef( {
    doStatus,
    setActive,
    active: false,
    batch: 0,
    timer: null,
    geocode: project.getGeocoder
  } );

  const startGeocoding = () => {
    const geocoder = geocoderRef.current;
    geocoder.active = true;
    const doGeocode = () => {
      geocoder.timer = null;
      if ( !geocoder.active ) {
        geocoder.doStatus( 'Geocoding stopped', false );
        return;
      }
      geocoder.batch += 1;
      geocoder.doStatus( `Geocoding batch #${geocoder.batch}`, true );
      geocoder.geocode()
        .then( ( result ) => {
          if ( result.success ) {
            const logs = [`Geocoding batch #${geocoder.batch}\n`];
            logs.push( ` Results: ${result.attempted} geocoded` );
            if ( result.incomplete.length > 0 ) {
              logs.push( ` ${result.incomplete.length} failed (errors listed below)` );
            }
            logs.push( '\n' );
            result.incomplete.forEach( ( inc ) => {
              logs.push( `  [${inc.id}] ${inc.location}: ${inc.reason}\n` );
            } );
            log( logs.join( '' ) );
            setEventCounts( result.events );
            if ( result.attempted > 0 && geocoder.active ) {
              geocoder.timer = setTimeout( doGeocode, 5000 );
              geocoder.doStatus(
                `${result.geocoded} of ${result.attempted} events geocoded. Waiting for next batch`,
                true
              );
            } else {
              geocoder.active = false;
              geocoder.doStatus( `Geocoding ${result.attempted < 1 ? 'completed' : 'stopped'}`, false );
              geocoder.setActive( INACTIVE );
            }
          } else {
            geocoder.active = false;
            geocoder.doStatus( `Geocoding encountered an error: ${result.error}`, false );
            geocoder.setActive( INACTIVE );
          }
        } );
    };
    doGeocode();
  };

  const handleGeocode = () => {
    setActive( STARTING );
  };

  const handleStop = () => {
    setActive( STOPPING );
  };

  useEffect( () => {
    const geocoder = geocoderRef.current;
    if ( active === STOPPING && geocoder.active ) {
      geocoder.active = false;
      geocoder.setActive = setActive;
      if ( geocoder.timer ) {
        clearTimeout( geocoder.timer );
        geocoder.timer = null;
        geocoder.doStatus( 'Geocoding stopped', false );
        setActive( INACTIVE );
      }
    } else if ( active === STARTING && !geocoder.active ) {
      startGeocoding();
      setActive( ACTIVE );
    }
  }, [active] );

  return (
    <div className="iip-admin-map-events-geocoder">
      <div className="iip-map-admin-events-container">
        <div className="iip-map-admin-events-header">
          <div className="iip-map-admin-events-downloader__info">
            <span>
              <b>Geocoded Events: </b>
              { `${eventCounts.geocoded} / ${eventCounts.total}` }
            </span>
          </div>
          <div className="iip-map-admin-events-downloader__info">
            <span>
              <b>Status: </b>
              { status || 'Inactive' }
            </span>
          </div>
          <div className="iip-map-admin-events-downloader__download">
            { active <= STOPPING && (
              <button
                className="button button-large"
                type="button"
                onClick={ handleGeocode }
                disabled={ active !== INACTIVE }
              >
                { active === STOPPING ? 'Stopping' : 'Geocode Events' }
              </button>
            ) }
            { active >= STARTING && (
              <button className="button button-large" type="button" onClick={ handleStop }>
                Stop Geocoding
              </button>
            ) }
          </div>
        </div>
      </div>
    </div>
  );
};

EventsGeocoder.propTypes = {
  project: PropTypes.shape( {
    geocode: PropTypes.func
  } ),
  eventCounts: PropTypes.shape( {
    total: PropTypes.string,
    geocoded: PropTypes.string
  } ),
  setEventCounts: PropTypes.func,
  log: PropTypes.func
};

export default EventsGeocoder;
