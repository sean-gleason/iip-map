import React from 'react';
import ReactDOM from 'react-dom';

import MapAdminMain from './Components/AdminSections/MapAdminMain';
import MapAdminSidebar from './Components/AdminSections/MapAdminSidebar';

import './index.css';

ReactDOM.render(
  <MapAdminMain />,
  document.getElementById( 'iip-map-admin-main' )
);

ReactDOM.render(
  <MapAdminSidebar />,
  document.getElementById( 'iip-map-admin-sidebar' )
);

module.hot.accept();
