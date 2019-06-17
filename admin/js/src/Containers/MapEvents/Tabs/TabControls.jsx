import React from 'react';
import * as PropTypes from 'prop-types';

const TabControls = ( {
  handleSave, children, label, errors, disabled
} ) => (
  <div className="iip-map-admin-mapping__controls">
    { errors && errors.length > 0 && (
      <div className="iip-map-admin-mapping__controls--errors iip-map-admin-mapping__controls--item">
        { errors.join( '\n' ) }
      </div>
    ) }
    { children !== null && !Array.isArray( children ) && (
      <div className="iip-map-admin-mapping__controls--item">
        { children }
      </div>
    ) }
    { children !== null && Array.isArray( children ) && children.map( child => (
      <div className="iip-map-admin-mapping__controls--item" key={ `${child.key}-item` }>
        { child }
      </div>
    ) ) }
    { handleSave !== null && (
      <div className="iip-map-admin-mapping__controls--save iip-map-admin-mapping__controls--item">
        <button
          id="iip-map-admin-mapping--save-button"
          className="button button-large iip-map-admin-button"
          type="button"
          value="save"
          data-dirty={ false }
          disabled={ disabled }
          onClick={ handleSave }
        >
          { label || 'Save & Continue' }
        </button>
      </div>
    ) }
  </div>
);

TabControls.propTypes = {
  handleSave: PropTypes.func,
  children: PropTypes.oneOfType( [
    PropTypes.element,
    PropTypes.arrayOf( PropTypes.element )
  ] ),
  label: PropTypes.string,
  errors: PropTypes.arrayOf( PropTypes.string ),
  disabled: PropTypes.bool
};

TabControls.defaultProps = {
  children: null,
  disabled: false
};

export default TabControls;
