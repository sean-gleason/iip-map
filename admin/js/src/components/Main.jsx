import React from 'react';

import MapProvider from '../context/MapProvider';
import Portal from './Portal';
import ConfigureMap from './Metaboxes/ConfigureMap/ConfigureMap';
import MapEvents from './Metaboxes/MapEvents/MapEvents';
import UpdateMarker from './Metaboxes/UpdateMarker';
import DataExporter from './Metaboxes/DataExporter';
import DataImporter from './Metaboxes/DataImporter';


const Main = () => {
  const containers = [
    'main--map', 'main--fields', 'sidebar--marker', 'sidebar--export', 'sidebar--import'
  ];
  containers.forEach( ( id ) => {
    document.getElementById( `iip-map-admin-${id}` ).innerHTML = null;
  } );
  return (
    <MapProvider>
      <Portal container="main--map">
        <ConfigureMap />
      </Portal>
      <Portal container="main--fields">
        <MapEvents />
      </Portal>
      <Portal container="sidebar--marker">
        <UpdateMarker />
      </Portal>
      <Portal container="sidebar--export">
        <DataExporter />
      </Portal>
      <Portal container="sidebar--import">
        <DataImporter />
      </Portal>
    </MapProvider>
  );
};

export default Main;
