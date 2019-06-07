import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import Logger from '../../Components/Logger/Logger';

import { getMapEvents } from '../../utils/globals';

const EventsDownloader = ( { project, updated } ) => {
  const [logs, setLogs] = useState( [] );
  const [status, setStatus] = useState( null );
  const [pager, setPager] = useState( null );

  let task = null;

  const log = ( item ) => {
    let str = null;
    if ( typeof item === 'string' ) {
      str = item;
    } else {
      str = JSON.stringify( item, null, 2 );
    }
    if ( str ) {
      const d = new Date();
      const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      logs.push( `${d.toLocaleString( 'en-us', opts )}| ${str}` );
      setLogs( [...logs] );
    }
  };

  const doStatus = ( text, running = true ) => {
    if ( task ) {
      clearTimeout( task );
      task = null;
    }
    const dots = [];
    const update = () => {
      setStatus( `${text}${dots.join( '' )}` );
      dots.push( '.' );
      if ( running ) {
        task = setTimeout( update, 750 );
      }
    };
    update();
  };

  const startDownload = () => {
    pager.active = true;
    const process = () => {
      if ( !pager.active ) {
        doStatus( 'Download canceled', false );
        return;
      }
      doStatus( `Downloading events page ${pager.page + 1}` );
      pager.next()
        .then( ( resp ) => {
          doStatus( `Processing events from page ${pager.page}` );
          if ( !resp || !resp.length ) {
            doStatus( 'Event processing complete', false );
            pager.active = false;
            setPager( null );
          } else {
            return resp;
          }
        } )
        .then( ( resp ) => {
          const events = [];
          resp.forEach( ( ev ) => {
            const event = project.applyMapping( ev );
            events.push( event );
            // log( `Processed event [${event.ext_id}]: ${event.title}` );
          } );
          return events;
        } )
        .then( ( events ) => {
          project.saveEvents( events )
            .then( ( result ) => {
              if ( result.success ) {
                log( `  ${events.length} event${events.length !== 1 ? 's' : ''} saved successfully` );
                log( `  Result: ${result.data || 0} created` );
              }
            } )
            .catch( ( saveEventsErr ) => {
              console.log( saveEventsErr );
              log( '------------- EVENT SAVE ERROR -------------' );
              log( saveEventsErr.toString() );
            } )
            .finally( process );
        } )
        .catch( ( downloadErr ) => {
          console.log( downloadErr );
          log( '------------- DOWNLOAD ERROR -------------' );
          log( downloadErr.toString() );
        } );
    };
    process();
  };

  const handleDownload = () => {
    setLogs( [] );
    setPager( project.getEventsPager( 20 ) );
  };

  const handleCancel = () => {
    pager.active = false;
    setPager( null );
  };

  useEffect( () => {
    if ( pager ) {
      startDownload();
    }
  }, [pager] );

  return (
    <div className="iip-map-admin-events-downloader">
      <h2>
        Downloader
      </h2>
      <div className="iip-map-admin-events-container">
        <div className="iip-map-admin-events-header">
          <div className="iip-map-admin-events-downloader__info">
            <span>
              <b>Project ID: </b>
              { `${project.projectId}` }
            </span>
            <span>
              <b>Total Existing Events: </b>
              { `${getMapEvents.events}` }
            </span>
            <span>
              <b>Geocoded Events: </b>
              { `${getMapEvents.geoEvents} / ${getMapEvents.events}` }
            </span>
          </div>
        </div>
        <div className="iip-map-admin-events-downloader__info">
          <span>
            <b>Status: </b>
            { status || `Download ${updated ? 'REQUIRED' : 'not required'}` }
          </span>
        </div>
        <div className="iip-map-admin-events-downloader__download">
          { ( !pager || !pager.active ) && (
            <button className="button button-large" type="button" onClick={ handleDownload }>
              Download Events
            </button>
          ) }
          { pager && pager.active && (
            <button className="button button-large" type="button" onClick={ handleCancel }>
              Stop Download
            </button>
          ) }
        </div>
        <div className="iip-map-admin-events-downloader__log">
          <Logger className="iip-map-admin-log" id="downloader-log" log={ logs } />
        </div>
      </div>
    </div>
  );
};

EventsDownloader.propTypes = {
  project: PropTypes.shape( {
    mapping: PropTypes.object,
    card: PropTypes.object,
    postId: PropTypes.number,
    projectId: PropTypes.string,
    form: PropTypes.array,
    save: PropTypes.func,
    update: PropTypes.func,
    getEvents: PropTypes.func,
    getFields: PropTypes.func
  } ),
  updated: PropTypes.bool
};

export default EventsDownloader;
