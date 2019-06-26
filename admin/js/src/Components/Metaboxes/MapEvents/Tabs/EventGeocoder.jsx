import React, {
  Fragment, useEffect, useReducer, useRef, useState
} from 'react';
import * as PropTypes from 'prop-types';
import Logger, { logMessage } from '../../../Logger/Logger';
import StatusTimer from '../../../StatusTimer/StatusTimer';
import TabControls from './TabControls';

const EventGeocoder = ( {
  project, isDirty, eventCounts, setEventCounts, setProcessing
} ) => {
  const [logs, setLogs] = useState( [] );
  const [state, setState] = useReducer( ( prevState, update ) => ( { ...prevState, ...update } ), {
    active: false,
    batch: 0,
    nextTimer: 0,
    nextBatch: false,
    status: `${isDirty ? 'Geocoding REQUIRED' : 'Geocoding not required'}`,
    statusActive: false
  } );
  const stopRef = useRef( false );
  const logsRef = useRef( [] );

  const log = ( item ) => {
    setLogs( logMessage( item, logsRef ) );
  };

  const doStatus = ( text, running = true, noLog = false ) => {
    if ( !noLog ) {
      log( text );
    }
    setState( {
      status: text,
      statusActive: running
    } );
  };

  const handleError = ( err ) => {
    console.log( err );
    log( [
      '------------- ERROR -------------',
      err.toString(),
      'Geocoding stopped'
    ] );
    doStatus( 'Geocoding stopped', false, true );
  };

  const nextBatch = () => {
    setState( { batch: state.batch + 1 } );
  };

  const processResult = ( result ) => {
    if ( result.success ) {
      const strs = [` Results: ${result.geocoded} of ${result.attempted} geocoded`];
      if ( result.incomplete.length > 0 ) {
        strs.push( ` ${result.incomplete.length} failed (errors listed below)` );
      }
      strs.push( '\n' );
      result.incomplete.forEach( ( inc ) => {
        strs.push( `  [${inc.id}] ${inc.location}: ${inc.reason}\n` );
      } );
      log( strs.join( '' ).replace( /\n+$/, '' ) );
      setEventCounts( result.events );

      if ( result.attempted > 0 && !stopRef.current && result.more ) {
        doStatus( `${result.geocoded} of ${result.attempted} events geocoded.\nWaiting for next batch`, true, true );
      } else {
        if ( result.attempted < 1 || !result.more ) {
          doStatus( 'Geocoding completed', false );
        }
        stopRef.current = true;
      }
    } else if ( result.error ) {
      throw new Error( result.error );
    } else {
      log( 'Unknown error geocoding this batch.' );
      doStatus( 'Unknown error geocoding this batch.\nWaiting for next batch', true, true );
    }
  };

  const doRequest = () => {
    project.geocode()
      .then( processResult )
      .then( () => {
        if ( !stopRef.current ) {
          setState( {
            nextTimer: 0,
            nextBatch: true
          } );
        } else {
          nextBatch();
        }
      } )
      .catch( ( err ) => {
        handleError( err );
        stopRef.current = true;
        nextBatch();
      } );
  };

  const start = () => {
    setProcessing( true );
    log();
    log( 'Starting geocoder' );
    nextBatch();
  };

  const handleAction = () => {
    if ( state.active ) {
      stopRef.current = true;
      if ( state.nextTimer ) {
        clearTimeout( state.nextTimer );
        setState( {
          nextBatch: false,
          nextTimer: 0,
          batch: 0,
          active: false
        } );
      } else {
        doStatus( 'Stopping geocoder' );
      }
    } else {
      setState( {
        batch: 0,
        active: true,
        nextTimer: 0,
        nextBatch: false,
        status: '',
        statusActive: false
      } );
    }
  };

  useEffect( () => {
    if ( state.nextBatch ) {
      const nextTimer = setTimeout( () => {
        setState( {
          nextTimer: 0,
          nextBatch: false,
          batch: state.batch + 1
        } );
      }, 5000 );
      setState( { nextTimer } );
      return () => clearTimeout( nextTimer );
    }
  }, [state.nextBatch] );

  useEffect( () => {
    if ( state.active ) {
      start();
    }
  }, [state.active] );

  useEffect( () => {
    if ( stopRef.current ) {
      stopRef.current = false;
      if ( state.statusActive ) {
        doStatus( 'Geocoding stopped', false );
      }
      setState( {
        active: false
      } );
      setProcessing( false );
      return;
    }
    if ( !state.active || !state.batch ) return;
    doStatus( `Geocoding batch #${state.batch}` );
    doRequest();
  }, [state.batch] );

  useEffect( () => {
    if ( isDirty && !state.active && !stopRef.current ) {
      doStatus( 'Geocoding REQUIRED', false, true );
    }
  }, [isDirty] );

  const getButtonText = () => {
    if ( !state.active ) return 'Start Geocoder';
    if ( !stopRef.current ) return 'Stop Geocoder';
    return 'Stopping';
  };

  return (
    <Fragment>
      <div className="react-tabs__tab-panel--inner iip-map-admin-events">
        <div className="iip-map-admin-events__column">
          <Logger className="iip-map-admin-log" id="geocoder-log" log={ logs } />
        </div>
        <div className="iip-map-admin-events__column iip-map-admin-events__stats">
          <div className="iip-map-admin-events__info">
            <span>
              <b>Project ID: </b>
              { `${project.projectId}` }
            </span>
          </div>
          <div className="iip-map-admin-events__info">
            <span>
              <b>Geocoded Events: </b>
              { `${eventCounts.geocoded} / ${eventCounts.total}` }
            </span>
          </div>
          <div className="iip-map-admin-events__info">
            <StatusTimer
              text={ state.status }
              running={ state.statusActive }
            />
          </div>
        </div>
      </div>
      <TabControls
        handleSave={ handleAction }
        label={ getButtonText() }
        disabled={ !isDirty || ( state.active && stopRef.current ) }
      />
    </Fragment>
  );
};

EventGeocoder.propTypes = {
  project: PropTypes.object,
  isDirty: PropTypes.bool,
  eventCounts: PropTypes.object,
  setEventCounts: PropTypes.func,
  setProcessing: PropTypes.func
};

export default EventGeocoder;
