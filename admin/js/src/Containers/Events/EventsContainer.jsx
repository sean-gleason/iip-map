import React, { useState } from 'react';
import { MapContext } from '../../Components/AdminSections/MapAdminMain';
import EventsDownloader from './EventsDownloader';
import EventsGeocoder from './EventsGeocoder';

import './EventsContainer.scss';
import Column from '../../Components/Column/Column';
import Logger from '../../Components/Logger/Logger';

const EventsContainer = () => {
  const [logs, setLogs] = useState( [] );

  const log = ( item = null ) => {
    if ( !item ) {
      setLogs( [] );
      return;
    }
    let str = null;
    if ( typeof item === 'string' ) {
      str = item;
    } else {
      str = JSON.stringify( item, null, 2 );
    }
    if ( str ) {
      const d = new Date().toLocaleString( 'en-us', {
        hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
      } );
      logs.push( `${d} | ${str}` );
      setLogs( [...logs] );
    }
  };

  return (
    <div className="iip-map-admin-events">
      <div className="iip-map-admin-events-modal">
        <MapContext.Consumer>
          { ( {
            project, updated, setProject, eventCounts, setEventCounts
          } ) => (
            <div className="iip-map-admin-events-columns">
              <div className="iip-map-admin-events-columns--side">
                <Column title="Downloader">
                  <EventsDownloader
                    project={ project }
                    setProject={ setProject }
                    updated={ updated }
                    eventCounts={ eventCounts }
                    setEventCounts={ setEventCounts }
                    log={ log }
                  />
                </Column>
                <Column title="Geocoder">
                  <EventsGeocoder
                    project={ project }
                    eventCounts={ eventCounts }
                    setEventCounts={ setEventCounts }
                    log={ log }
                  />
                </Column>
              </div>
              <div className="iip-map-admin-events-columns--side">
                <Column title="Log">
                  <Logger className="iip-map-admin-log" id="downloader-log" log={ logs } />
                </Column>
              </div>
            </div>
          ) }
        </MapContext.Consumer>
      </div>
    </div>
  );
};

export default EventsContainer;
