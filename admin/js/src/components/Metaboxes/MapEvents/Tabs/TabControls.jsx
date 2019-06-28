import React from 'react';
import * as PropTypes from 'prop-types';

const TabControls = ( {
  handleSave, children, label, errors, disabled, warning, publishReminder
} ) => (
  <div className="iip-map-admin-mapping__controls">
    { publishReminder && (
      <div className="iip-map-admin-mapping__controls--row">
        <div className="iip-map-admin-mapping__controls--item iip-map-admin-mapping__warning">
          This map has not been published. Remember to click Publish when finished, or this map will be lost.
        </div>
      </div>
    ) }
    <div className="iip-map-admin-mapping__controls--row">
      { warning && (
        <div className="iip-map-admin-mapping__controls--errors iip-map-admin-mapping__controls--item">
          { warning }
        </div>
      ) }
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
  </div>
);

TabControls.propTypes = {
  handleSave: PropTypes.func,
  children: PropTypes.oneOfType( [
    PropTypes.element,
    PropTypes.arrayOf( PropTypes.element )
  ] ),
  label: PropTypes.string,
  warning: PropTypes.string,
  errors: PropTypes.arrayOf( PropTypes.string ),
  publishReminder: PropTypes.bool,
  disabled: PropTypes.bool
};

TabControls.defaultProps = {
  children: null,
  disabled: false,
  warning: null
};

export default TabControls;
