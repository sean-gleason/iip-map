import React from 'react';
import ReactDOM from 'react-dom';

import MapAdminMain from './Components/AdminSections/MapAdminMain';
import MapAdminSidebar from './Components/AdminSections/MapAdminSidebar';

import './index.scss';

ReactDOM.render(
  <MapAdminMain />,
  document.getElementById( 'iip-map-admin-main' )
);

ReactDOM.render(
  <MapAdminSidebar />,
  document.getElementById( 'iip-map-admin-sidebar' )
);

if ( module.hot ) { module.hot.accept(); }
