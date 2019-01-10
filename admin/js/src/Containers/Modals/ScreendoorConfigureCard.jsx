import React, { Component } from 'react';

import Column from '../../Components/Column/Column';
import ConfigsToggle from '../../Components/ConfigsToggle/ConfigsToggle';

import { getScreendoorFieldsMeta } from '../../utils/globals';

class ScreendoorConfigureCard extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      // fields: {},
      // additionalFields: getScreendoorFieldsMeta.otherArr,
      // datetimeFields: getScreendoorFieldsMeta.dateArr,
      // locationFields: getScreendoorFieldsMeta.locationArr,
      // nameField: getScreendoorFieldsMeta.nameArr
    };
  }

  render() {
    return (
      <div className="iip-map-admin-screendoor-dragdrop">
        <Column title="Card Preview">
          <div className="iip-map-admin-card-preview-container">
            <div className="iip-map-ol-popup-preview" id="infowindow-1">
              <h1 id="firstHeading" className="iip-map-ol-popup-preview-header"> name </h1>
              <div id="bodyContent-1" className="iip-map-ol-popup-preview-body">
                <h3 className="iip-map-ol-popup-preview-header">Topic: topic</h3>
                <p> Description </p>
                <h3 className="iip-map-ol-popup-preview-header">When: </h3>
                <p> On date at time </p>
                <h3 className="iip-map-ol-popup-preview-header">Where: </h3>
                <p> Venue name, Address</p>
              </div>
            </div>
          </div>
        </Column>
        <Column title="Configure Card">
          <div className="iip-map-admin-card-preview-container">
            <div className="iip-map-admin-card-preview">
              <ConfigsToggle checked label="Use name as title?">
                <label htmlFor="cardPreviewTitle">
                  Add text before title?
                  <input
                    name="cardPreviewTitle"
                    type="text"
                  />
                </label>
              </ConfigsToggle>
              <ConfigsToggle checked label="Add Date?" />
              <ConfigsToggle checked label="Add Time?" />
              <ConfigsToggle label="Add section?" />
            </div>
          </div>
        </Column>
      </div>
    );
  }
}

export default ScreendoorConfigureCard;
