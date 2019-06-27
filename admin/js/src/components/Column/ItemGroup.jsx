import React from 'react';
import * as PropTypes from 'prop-types';

const ItemGroup = ( {
  children, required, hasError, title, subtext
} ) => (
  <div className={ `iip-map-admin-column-item-group${hasError ? ' invalid' : ''}` }>
    <div className="iip-map-admin-column-item-group-container">
      { !!subtext && (
        <div className="iip-map-admin-column-item-group__subtext">{ subtext }</div>
      ) }
      { title && (
        <strong data-required={ required }>{ title }</strong>
      ) }
      { children }
    </div>
  </div>
);

ItemGroup.propTypes = {
  children: PropTypes.element,
  required: PropTypes.bool,
  hasError: PropTypes.bool,
  title: PropTypes.string,
  subtext: PropTypes.string
};

ItemGroup.defaultProps = {
  required: false
};

export default ItemGroup;
