import React, { Component, Fragment } from 'react';

import Column from '../../Components/Column/Column';
import ConfigsToggle from '../../Components/ConfigsToggle/ConfigsToggle';

import { getScreendoorFields } from '../../utils/globals';
import { collapseArr } from '../../utils/helpers';

class ScreendoorConfigureCard extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      dateSection: {
        date: collapseArr( getScreendoorFields.dateArr ),
        heading: 'When:',
        hasTime: false,
        time: collapseArr( getScreendoorFields.timeArr ),
        timeFormat: '12hour',
        toggled: !!( ( getScreendoorFields.dateArr && getScreendoorFields.dateArr.length > 0 ) )
      },
      locationSection: {
        heading: 'Where:',
        location: collapseArr( getScreendoorFields.locationArr ),
        toggled: !!( ( getScreendoorFields.locationArr && getScreendoorFields.locationArr.length > 0 ) )
      },
      titleSection: {
        name: collapseArr( getScreendoorFields.nameArr ),
        postTitle: '',
        preTitle: '',
        toggled: !!( ( getScreendoorFields.nameArr && getScreendoorFields.nameArr.length > 0 ) )
      },
      additionalSection: {
        fields: getScreendoorFields.otherArr,
        toggled: !!( ( getScreendoorFields.otherArr && getScreendoorFields.otherArr.length > 0 ) )
      },
      added: []
    };
  }

  handleAddArrayInput = ( group, ...args ) => {
    const obj = {};
    args.forEach( ( arg ) => {
      obj[arg] = '';
      return obj;
    } );

    this.setState( prevState => ( {
      [group]: [...prevState[group], obj]
    } ) );
  };

  handleArrayInput = ( e ) => {
    const { group, index } = e.target.dataset;
    const stateGroup = this.state[group]; // eslint-disable-line react/destructuring-assignment
    const obj = Object.assign( [], stateGroup );
    const property = e.target.name;

    obj[index][property] = e.target.value;

    this.setState( { [group]: obj } );
  };

  handleDeleteItem = ( e ) => {
    const { group, index } = e.target.dataset;
    const stateGroup = this.state[group]; // eslint-disable-line react/destructuring-assignment
    const obj = Object.assign( [], stateGroup );
    obj.splice( index, 1 );

    this.setState( {
      [group]: obj
    } );
  };

  handleInput = ( e ) => {
    const { group } = e.target.dataset;
    const stateGroup = this.state[group]; // eslint-disable-line react/destructuring-assignment
    const obj = Object.assign( [], stateGroup );
    const property = e.target.name;

    obj[property] = e.target.value;

    this.setState( { [group]: obj } );
  };

  updateToggleState = ( e ) => {
    console.log( e );
  };

  render() {
    const {
      added, dateSection, additionalSection, locationSection, titleSection
    } = this.state;

    return (
      <div className="iip-map-admin-screendoor-dragdrop">
        <Column title="Card Preview">
          <div className="iip-map-admin-card-preview-container">
            <div className="iip-map-ol-popup-preview" id="infowindow-1">
              { titleSection.toggled && (
                <h1 id="firstHeading" className="iip-map-ol-popup-preview-header">
                  { `${titleSection.preTitle} { ${titleSection.name} } ${titleSection.postTitle}` }
                </h1>
              ) }
              <div id="bodyContent-1" className="iip-map-ol-popup-preview-body">
                { dateSection.toggled && (
                  <Fragment>
                    <h3 className="iip-map-ol-popup-preview-header">{ dateSection.heading || '' }</h3>
                    <p>{ `{ ${dateSection.date} }` }</p>
                    { dateSection.hasTime && (
                      <p>{ `{ ${dateSection.time} }` }</p>
                    ) }
                  </Fragment>
                ) }
                { locationSection.toggled && (
                  <Fragment>
                    <h3 className="iip-map-ol-popup-preview-header">{ locationSection.heading || '' }</h3>
                    <p>{ `{ ${locationSection.location} }` }</p>
                  </Fragment>
                ) }
                { added.length > 0 && (
                  <div>
                    { added.map( item => (
                      <Fragment>
                        <h3 className="iip-map-ol-popup-preview-header">{ item.heading }</h3>
                        <p style={ { whiteSpace: 'pre-wrap' } }>
                          { `${item.inlinePre} { ${item.field} } ${item.inlinePost}` }
                        </p>
                      </Fragment>
                    ) ) }
                  </div>
                ) }
              </div>
            </div>
          </div>
        </Column>
        <Column title="Configure Card">
          <div className="iip-map-admin-card-preview-container">
            <div className="iip-map-admin-card-preview">
              <ConfigsToggle
                toggled={ titleSection.toggled }
                label="Show Title?"
                callback={ this.updateToggleState }
              >
                <label className="iip-map-admin-label" htmlFor="preTitle">
                  Add text before title?
                  <input
                    className="iip-map-admin-project-input"
                    data-group="titleSection"
                    name="preTitle"
                    onChange={ this.handleInput }
                    type="text"
                    value={ titleSection.preTitle }
                  />
                </label>
                <label className="iip-map-admin-label" htmlFor="postTitle">
                  Add text after title?
                  <input
                    className="iip-map-admin-project-input"
                    data-group="titleSection"
                    name="postTitle"
                    onChange={ this.handleInput }
                    type="text"
                    value={ titleSection.postTitle }
                  />
                </label>
              </ConfigsToggle>
              <ConfigsToggle toggled={ dateSection.toggled } label="Add Date?">
                <label className="iip-map-admin-label" htmlFor="heading">
                  Section header (optional):
                  <input
                    className="iip-map-admin-project-input"
                    data-group="dateSection"
                    name="heading"
                    onChange={ this.handleInput }
                    type="text"
                    value={ dateSection.heading }
                  />
                </label>
                <ConfigsToggle toggled={ dateSection.hasTime } label="Add Time?">
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
              <ConfigsToggle toggled={ locationSection.toggled } label="Add Location?">
                <label className="iip-map-admin-label" htmlFor="heading">
                  Section header (optional):
                  <input
                    className="iip-map-admin-project-input"
                    data-group="locationSection"
                    name="heading"
                    onChange={ this.handleInput }
                    type="text"
                    value={ locationSection.heading }
                  />
                </label>
              </ConfigsToggle>
              { additionalSection.toggled && (
              <div className="iip-map-admin-card-preview-option">
                <div className="iip-map-admin-card-preview-option-top">
                  <p className="iip-map-admin-card-preview-toggle-label">Add section?</p>
                  <button
                    onClick={ () => {
                      this.handleAddArrayInput( 'added', 'field', 'heading', 'inlinePre', 'inlinePost' );
                    } }
                    type="button"
                  >
                        +
                  </button>
                </div>
                { added.map( ( value, index ) => {
                  const position = index + 1;
                  return (
                    <div className="iip-map-admin-card-preview-meta">
                      <div className="iip-map-admin-new-section-header">
                        <p className="iip-map-admin-card-preview-toggle-sublabel">
                          { `Custom Section #${position}` }
                        </p>
                        <button
                          className="iip-event-close-btn"
                          data-group="added"
                          data-index={ index }
                          onClick={ this.handleDeleteItem }
                          type="button"
                        >
                              X
                        </button>
                      </div>
                      <label className="iip-map-admin-label" htmlFor="field">
                            Choose field:
                        <select
                          className="iip-map-admin-project-input"
                          data-group="added"
                          data-index={ index }
                          name="field"
                          value=""
                        >
                          <option value="">Please select a field</option>
                          { additionalSection.fields.map( item => (
                            <option value={ item.name }>{ item.name }</option>
                          ) ) }
                        </select>
                      </label>
                      <label className="iip-map-admin-label" htmlFor="heading">
                            Section header (optional):
                        <input
                          className="iip-map-admin-project-input"
                          data-group="added"
                          data-index={ index }
                          onChange={ this.handleArrayInput }
                          name="heading"
                          type="text"
                        />
                      </label>
                      <label className="iip-map-admin-label stacked" htmlFor="inlinePre">
                            Inline text before item (optional):
                        <textarea
                          className="iip-map-admin-project-textarea"
                          data-group="added"
                          data-index={ index }
                          onChange={ this.handleArrayInput }
                          name="inlinePre"
                        />
                      </label>
                      <label className="iip-map-admin-label stacked" htmlFor="inlinePost">
                            Inline text after item (optional):
                        <textarea
                          className="iip-map-admin-project-textarea"
                          data-group="added"
                          data-index={ index }
                          onChange={ this.handleArrayInput }
                          name="inlinePost"
                        />
                      </label>
                    </div>
                  );
                } ) }
              </div>
              )
              }
            </div>
          </div>
        </Column>
      </div>
    );
  }
}

export default ScreendoorConfigureCard;
