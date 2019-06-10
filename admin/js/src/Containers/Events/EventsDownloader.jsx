import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';

const EventsDownloader = ( {
  project, updated, setProject, eventCounts, setEventCounts, log
} ) => {
  const [status, setStatus] = useState( null );
  const [pager, setPager] = useState( null );

  let task = null;

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
          } );
          return events;
        } )
        .then( ( events ) => {
          project.saveEvents( events )
            .then( ( result ) => {
              if ( result.success ) {
                const creates = result.created || 0;
                const updates = result.updated;
                log( [
                  `${creates} event${creates !== 1 ? 's' : ''} created`,
                  `${updates} event${updates !== 1 ? 's' : ''} updated`
                ].join( ', ' ) );
                setEventCounts( result.events );
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
    log();
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
      <div className="iip-map-admin-events-container">
        <div className="iip-map-admin-events-header">
          <div className="iip-map-admin-events-downloader__info">
            <span>
              <b>Project ID: </b>
              { `${project.projectId}` }
            </span>
            <span>
              <b>Total Existing Events: </b>
              { `${eventCounts.total}` }
            </span>
          </div>
        </div>
        <div className="iip-map-admin-events-downloader__info">
          <span>
            <b>Status: </b>
            { status || `Download ${updated || eventCounts.total === '0' ? 'REQUIRED' : 'not required'}` }
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
    getFields: PropTypes.func,
    events: PropTypes.shape( {
      total: PropTypes.string,
      geocoded: PropTypes.string
    } )
  } ),
  updated: PropTypes.bool,
  setProject: PropTypes.func,
  eventCounts: PropTypes.object,
  setEventCounts: PropTypes.func,
  log: PropTypes.func
};

export default EventsDownloader;
