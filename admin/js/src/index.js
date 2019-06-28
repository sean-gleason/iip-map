import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

import ConfigureMap from './components/Metaboxes/ConfigureMap/ConfigureMap';
import DataExporter from './components/Metaboxes/DataExporter';
import DataImporter from './components/Metaboxes/DataImporter';
import UpdateMarker from './components/Metaboxes/UpdateMarker';
import MapEvents from './components/Metaboxes/MapEvents/MapEvents';

ReactDOM.render(
  <ConfigureMap />,
  document.getElementById( 'iip-map-admin-main--map' )
);

ReactDOM.render(
  <MapEvents />,
  document.getElementById( 'iip-map-admin-main--fields' )
);

ReactDOM.render(
  <UpdateMarker />,
  document.getElementById( 'iip-map-admin-sidebar--marker' )
);

ReactDOM.render(
  <DataExporter />,
  document.getElementById( 'iip-map-admin-sidebar--export' )
);

ReactDOM.render(
  <DataImporter />,
  document.getElementById( 'iip-map-admin-sidebar--import' )
);

if ( module.hot ) { module.hot.accept(); }
