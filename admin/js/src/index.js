import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

import ConfigureMap from './Components/Metaboxes/ConfigureMap/ConfigureMap';
import DataExporter from './Components/Metaboxes/DataExporter';
import UpdateMarker from './Components/Metaboxes/UpdateMarker';
import MapEvents from './Components/Metaboxes/MapEvents/MapEvents';

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

if ( module.hot ) { module.hot.accept(); }
