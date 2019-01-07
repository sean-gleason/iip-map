import React, { Component } from 'react';
import Column from '../../Components/Column/Column';

class ScreendoorConfigureCard extends Component {
  render() {
    return(
      <div className="iip-map-admin-screendoor-dragdrop">
        <Column title="Card Preview">
          <div className="iip-map-admin-card-preview-container">
            <div className="iip-map-admin-card-preview">test</div>
          </div>
        </Column>
        <Column title="Test" />
      </div>
    )
  }
}

export default ScreendoorConfigureCard;
