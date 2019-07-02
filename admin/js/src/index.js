import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import Main from './components/Main';

ReactDOM.render(
  <Main />,
  document.getElementById( 'iip-map-admin-main--root' )
);

if ( module.hot ) { module.hot.accept(); }
