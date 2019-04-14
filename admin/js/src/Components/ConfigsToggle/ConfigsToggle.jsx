import React, { Component } from 'react';
import { bool, element, string } from 'prop-types';

import Toggle from '../Toggle/Toggle';

class ConfigsToggle extends Component {
  state = {};

  componentDidMount() {
    const { toggled } = this.props;

    this.setState( {
      toggled
    } );
  }

  handleChange = () => {
    const { toggled } = this.state;
    const flipped = !toggled;

    this.setState( {
      toggled: flipped
    } );
  }

  render() {
    const { children, label } = this.props;
    const { toggled } = this.state;

    return (
      <div className="iip-map-admin-card-preview-option">
        <div className="iip-map-admin-card-preview-option-top">
          <p className="iip-map-admin-card-preview-toggle-label">{ label }</p>
          <Toggle toggled={ toggled } callback={ this.handleChange } />
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
  children: element,
  label: string,
  toggled: bool
};

export default ConfigsToggle;
