import React from 'react';
import ReactDOM from 'react-dom';

import FormMapper from './containers/FormMapper/FormMapper';

ReactDOM.render(
  <FormMapper />,
  document.getElementById('iip-map-admin-page')
);

module.hot.accept();