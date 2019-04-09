import React, { Component } from 'react';
import { bool, element, string } from 'prop-types';

import Toggle from '../Toggle/Toggle';

class ConfigsToggle extends Component {
  constructor( props ) {
    super( props );
    this.state = {};

    this.handleChange = this.handleChange.bind( this );
  }

  componentDidMount() {
    const { checked } = this.props;

    this.setState( {
      toggled: checked
    } );
  }

  handleChange() {
    const { toggled } = this.state;
    const flipped = !toggled;

    this.setState( {
      toggled: flipped
    } );
  }

  render() {
    const { checked, children, label } = this.props;
    const { toggled } = this.state;

    return (
      <div className="iip-map-admin-card-preview-option">
        <div className="iip-map-admin-card-preview-option-top">
          <p className="iip-map-admin-card-preview-toggle-label">{ label }</p>
          <Toggle checked={ checked } callback={ this.handleChange } />
        </div>
        { toggled && (
          <div className="iip-map-admin-card-preview-meta">
            { children }
          </div>
        ) }
      </div>
    );
  }
}

ConfigsToggle.propTypes = {
  checked: bool,
  children: element,
  label: string
};

export default ConfigsToggle;
