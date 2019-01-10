import React, { Component } from 'react';
import { bool } from 'prop-types';

import './Toggle.css';

class Toggle extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      checked: this.props.checked
    };

    this.checkbox = null;

    this.setCheckboxRef = ( element ) => {
      this.checkbox = element;
    };

    this.handleClick = this.handleClick.bind( this );
  }

  handleClick( e ) {
    const { checkbox } = this;
    const newChecked = !checkbox.checked;

    this.setState( {
      checked: newChecked
    } );
  }

  render() {
    const { checked } = this.state;

    return (
      <div
        className={ checked ? 'iip-map-admin-toggle toggle-checked' : 'iip-map-admin-toggle toggle-unchecked' }
        onClick={ this.handleClick }
        onKeyPress={ this.handleClick }
        role="button"
        tabIndex="0"
      >
        <div className="iip-map-admin-toggle-track" />
        <div className="iip-map-admin-toggle-handle" />
        <input
          className="iip-map-admin-toggle-checkbox"
          checked={ checked }
          ref={ this.setCheckboxRef }
          type="checkbox"
          value=""
        />
      </div>
    );
  }
}

Toggle.propTypes = {
  checked: bool
};

export default Toggle;
