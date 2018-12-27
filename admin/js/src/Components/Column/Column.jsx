import React from 'react';
import { node, string } from 'prop-types';

const Column = ( { children, title } ) => (
  <div className="iip-map-admin-column-container">
    <h3 className="iip-map-admin-column-title">{ title }</h3>
    { children }
  </div>
);

Column.propTypes = {
  children: node,
  title: string
};

export default Column;
