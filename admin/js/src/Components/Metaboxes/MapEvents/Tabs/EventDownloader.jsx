import React, {
  Fragment, useEffect, useReducer, useRef, useState
} from 'react';
import * as PropTypes from 'prop-types';

import TabControls from './TabControls';
import Logger, { logMessage } from '../../../Logger/Logger';
import StatusTimer from '../../../StatusTimer/StatusTimer';

const EventDownloader = ( {
  project, eventCounts, setEventCounts, doNext, setProcessing
} ) => {
  const [errors] = useState( [] );
  const [logs, setLogs] = useState( [] );
  const [pager, setPager] = useReducer( ( state, update ) => ( { ...state, ...update } ), {
    page: 0,
    active: false,
    status: `Download ${eventCounts.total === '0' ? 'REQUIRED' : 'not required'}`,
    statusActive: false
  } );

  const stopRef = useRef( false );
  const logsRef = useRef( [] );

  const setPage = val => setPager( { page: val } );
  const setActive = val => setPager( { active: val } );

  const log = ( item ) => {
    setLogs( logMessage( item, logsRef ) );
  };

  const doStatus = ( text, running = true ) => {
    log( text );
    setPager( {
      status: text,
      statusActive: running
    } );
  };

  const handleError = logTitle => ( err ) => {
    console.log( err );
    log( [
      `------------- ${logTitle} -------------`,
      err.toString()
    ] );
  };

  const processEvents = ( resp ) => {
    if ( stopRef.current ) return null;
    doStatus( `Processing events from page ${pager.page}` );
    if ( resp && resp.length > 0 ) {
      const events = [];
      resp.forEach( ( eventData ) => {
        events.push( project.applyMapping( eventData ) );
      } );
      return events;
    }
    doStatus( 'Event processing complete', false );
    setActive( false );
    setProcessing( false );
  };

  const saveEvents = ( events ) => {
    if ( !events || stopRef.current ) return null;
    const handleSaveEventError = handleError( 'EVENT SAVE ERROR' );
    return project.saveEvents( events )
      .then( ( result ) => {
        if ( result.success ) {
          const creates = result.created || 0;
          const updates = result.updated;
          log( [
            `${creates} event${creates !== 1 ? 's' : ''} created`,
            `${updates} event${updates !== 1 ? 's' : ''} updated`
          ].join( ', ' ) );
          setEventCounts( result.events );
        } else if ( result.error ) {
          handleSaveEventError( result.error );
        }
        return result;
      } )
      .catch( handleSaveEventError );
  };

  const nextPage = () => setPage( pager.page + 1 );

  const requester = project.getEventsRequester( 100 );
  const doRequest = () => {
    requester( pager.page )
      .then( processEvents )
      .then( saveEvents )
      .then( nextPage )
      .catch( handleError( 'DOWNLOAD ERROR' ) );
  };

  const startPager = () => {
    setProcessing( true );
    log();
    log( 'Starting download' );
    nextPage();
  };

  const handleAction = () => {
    if ( pager.active ) {
      // do cancel
      doStatus( 'Stopping download' );
      stopRef.current = true;
    } else {
      setPager( {
        page: 0,
        active: true,
        status: '',
        statusActive: false
      } );
    }
  };

  useEffect( () => {
    if ( pager.active ) {
      startPager();
    }
  }, [pager.active] );

  useEffect( () => {
    if ( stopRef.current ) {
      stopRef.current = false;
      setPager( {
        stop: false,
        active: false
      } );
      doStatus( 'Download stopped', false );
      setProcessing( false );
      return;
    }
    if ( !pager.active || !pager.page ) return;
    doStatus( `Downloading events page ${pager.page}` );
    doRequest();
  }, [pager.page] );

  const getButtonText = () => {
    if ( !pager.active ) return 'Download Events';
    if ( !stopRef.current ) return 'Stop Download';
    return 'Stopping';
  };

  return (
    <Fragment>
      <div className="react-tabs__tab-panel--inner iip-map-admin-events">
        <div className="iip-map-admin-events__column">
          <Logger className="iip-map-admin-log" id="downloader-log" log={ logs } />
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
              <b>Total Existing Events: </b>
              { `${eventCounts.total}` }
            </span>
          </div>
          <div className="iip-map-admin-events__info">
            <StatusTimer
              text={ pager.status }
              running={ pager.statusActive }
            />
          </div>
        </div>
      </div>
      <TabControls
        errors={ errors }
        handleSave={ doNext }
        label="Continue"
        disabled={ eventCounts.total === '0' || pager.active }
      >
        <button
          key="map-events-download"
          className="button button-large"
          type="button"
          disabled={ pager.active && stopRef.current }
          onClick={ handleAction }
        >
          { getButtonText() }
        </button>
      </TabControls>
    </Fragment>
  );
};

EventDownloader.propTypes = {
  project: PropTypes.shape( {
    mapping: PropTypes.object,
    card: PropTypes.object,
    postId: PropTypes.number,
    projectId: PropTypes.string,
    form: PropTypes.array,
    save: PropTypes.func,
    update: PropTypes.func,
    getEvents: PropTypes.func,
    getFields: PropTypes.func,
    events: PropTypes.shape( {
      total: PropTypes.string,
      geocoded: PropTypes.string
    } )
  } ),
  eventCounts: PropTypes.object,
  setEventCounts: PropTypes.func,
  setProcessing: PropTypes.func,
  doNext: PropTypes.func
};

export default EventDownloader;
