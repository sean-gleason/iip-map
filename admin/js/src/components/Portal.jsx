import React from 'react';
import * as PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const Portal = ( { children, container } ) => (
  <div>
    { createPortal(
      children,
      document.getElementById( `iip-map-admin-${container}` )
    ) }
  </div>
);

Portal.propTypes = {
  children: PropTypes.oneOfType( [
    PropTypes.element,
    PropTypes.arrayOf( PropTypes.element )
  ] ),
  container: PropTypes.string
};

export default Portal;
