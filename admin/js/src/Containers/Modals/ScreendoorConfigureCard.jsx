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
              <ConfigsToggle toggled={ false } label="Show Title?">
                <label className="iip-map-admin-label" htmlFor="cardPreTitle">
                  Add text before title?
                  <input
                    className="iip-map-admin-project-input"
                    name="cardPreTitle"
                    type="text"
                  />
                </label>
                <br />
                <label className="iip-map-admin-label" htmlFor="cardPostTitle">
                  Add text after title?
                  <input
                    className="iip-map-admin-project-input"
                    name="cardPostTitle"
                    type="text"
                  />
                </label>
              </ConfigsToggle>
              <ConfigsToggle checked label="Add Date?">
                <label className="iip-map-admin-label" htmlFor="cardDateHeader">
                  Section header (optional):
                  <input
                    className="iip-map-admin-project-input"
                    name="cardDateHeader"
                    type="text"
                  />
                </label>
                <ConfigsToggle checked label="Add Time?">
                  <p className="iip-map-admin-card-preview-toggle-label" style={ { marginTop: '0' } }>Format:</p>
                  <label htmlFor="cardTimeFormat-12">
                    12 hour
                    <input
                      className="iip-map-admin-project-input"
                      id="cardTimeFormat-12"
                      name="cardTimeFormat"
                      type="radio"
                    />
                  </label>
                  <label htmlFor="cardTimeFormat-24">
                    24 hour
                    <input
                      className="iip-map-admin-project-input"
                      id="cardTimeFormat-24"
                      name="cardTimeFormat"
                      type="radio"
                    />
                  </label>
                </ConfigsToggle>
              </ConfigsToggle>
              <ConfigsToggle label="Add section?">
                <label className="iip-map-admin-label" htmlFor="cardSectionOneHeader">
                  Section header (optional):
                  <input
                    className="iip-map-admin-project-input"
                    name="cardSectionOneHeader"
                    type="text"
                  />
                </label>
              </ConfigsToggle>
            </div>
          </div>
        </Column>
      </div>
    );
  }
}

export default ScreendoorConfigureCard;
