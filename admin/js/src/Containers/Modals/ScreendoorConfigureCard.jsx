import React, { Component, Fragment } from 'react';
import equal from 'fast-deep-equal';
import * as PropTypes from 'prop-types';

import Column from '../../Components/Column/Column';
import ConfigsToggle from '../../Components/ConfigsToggle/ConfigsToggle';

import { collapseArr } from '../../utils/helpers';
import { getMapGlobalMeta } from '../../utils/globals';
import { getEvents } from '../../utils/screendoor';

class ScreendoorConfigureCard extends Component {
  constructor( props ) {
    super( props );
    const { card, mapping, getCardFromMapping } = props;
    if ( card ) {
      this.state = card;
    } else {
      this.state = getCardFromMapping( mapping );
      this.update();
    }
    this.state.preview = false;
    this.state.sample = null;
  }

  componentWillReceiveProps( nextProps, nextContext ) {
    const { id, mapping, getCardFromMapping } = this.props;
    if ( !nextProps.card || id !== nextProps.id ) {
      this.setState( prevState => ( {
        ...getCardFromMapping( nextProps.mapping ),
        preview: prevState.preview
      } ), () => this.update() );
    } else if ( !equal( mapping, nextProps.mapping ) ) {
      this.setState(
        prevState => ( {
          ...getCardFromMapping( nextProps.mapping, prevState ),
          preview: prevState.preview
        } ), () => this.update()
      );
    }
  }

  handleAddArrayInput = ( group, ...args ) => {
    const obj = {};
    args.forEach( ( arg ) => {
      obj[arg] = '';
      return obj;
    } );

    this.setState( prevState => ( {
      [group]: [...prevState[group], obj]
    } ), () => this.update() );
  };

  handleArrayInput = ( e ) => {
    const { group, index } = e.target.dataset;
    const { [group]: stateGroup } = this.state;
    // const obj = Object.assign( [], stateGroup );
    const property = e.target.name;

    stateGroup[index][property] = e.target.value;

    this.setState( { [group]: stateGroup }, () => this.update() );
  };

  handleDeleteItem = ( e ) => {
    const { group, index } = e.target.dataset;
    const { [group]: stateGroup } = this.state;
    const obj = Object.assign( [], stateGroup );
    obj.splice( index, 1 );

    this.setState( {
      [group]: obj
    }, () => this.update() );
  };

  handleInput = ( e ) => {
    const { group } = e.target.dataset;
    const { [group]: stateGroup } = this.state;
    if ( group === 'added' ) {
      const { index } = e.target.dataset;
      stateGroup[index][e.target.name] = e.target.value;
    } else {
      stateGroup[e.target.name] = e.target.value;
    }

    this.setState( { [group]: stateGroup }, () => this.update() );
  };

  updateToggleState = section => ( e ) => {
    const { [section]: sectionState } = this.state;
    this.setState( {
      [section]: {
        ...sectionState,
        toggled: e
      }
    }, () => this.update() );
  };

  parseField = ( name, field = null ) => {
    const { sample, timeSection } = this.state;
    const group = sample.groups.find( g => g.name === name );
    if ( !group ) return null;
    const { fields } = group;
    if ( name === 'added' ) {
      const val = fields.find( f => f.field === field );
      return val ? val.value : '';
    }
    if ( name === 'date' ) {
      const [{ value: { day, month, year } }] = fields;
      return `${month}/${day}/${year}`;
    }
    if ( name === 'time' ) {
      // eslint-disable-next-line camelcase
      const [{ value: { am_pm, hours, minutes } }] = fields;
      if ( timeSection.timeFormat === '24hour' ) {
        const h = parseInt( hours, 10 ) + 12;
        return `${h}:${minutes}`;
      }
      return `${hours}:${minutes} ${am_pm}`; // eslint-disable-line camelcase
    }
    return fields.map( f => f.value ).join( ', ' );
  };

  setSample = ( toggle ) => {
    const { sample } = this.state;
    if ( toggle && !sample ) {
      return this.getSample().then( ( events ) => {
        this.setState( {
          preview: toggle,
          sample: events[0]
        } );
      } ).catch( () => {
        this.setState( {
          preview: false,
          sample: false
        } );
      } );
    }
    this.setState( {
      preview: toggle
    } );
  };

  getSample = () => new Promise( ( resolve, reject ) => {
    const { id, mapping } = this.props;
    const apiKey = getMapGlobalMeta.screendoorKey;
    getEvents( id, apiKey )
      .then( ( result ) => {
        if ( !result || result.length < 1 ) return reject();
        const {
          nameFields, locationFields, dateFields, timeFields, additionalFields
        } = mapping;
        const mapFields = ( resps, map ) => {
          const fields = [];
          map.forEach( ( { field, name } ) => {
            if ( field in resps ) fields.push( { field, label: name, value: resps[field] } );
          } );
          return fields;
        };
        const events = [];
        result.forEach( ( eventData ) => {
          const { responses } = eventData;
          events.push( {
            ext_id: eventData.id,
            groups: [
              {
                name: 'title',
                fields: mapFields( responses, nameFields )
              },
              {
                name: 'location',
                fields: mapFields( responses, locationFields )
              },
              {
                name: 'date',
                fields: mapFields( responses, dateFields )
              },
              {
                name: 'time',
                fields: mapFields( responses, timeFields )
              },
              {
                name: 'added',
                fields: mapFields( responses, additionalFields )
              }
            ]
          } );
        } );
        resolve( events );
      } )
      .catch( ( err ) => {
        console.error( err );
        reject( err );
      } );
  } );

  update = () => {
    const { setCard, setDirty } = this.props;
    setCard( this.state );
    setDirty( true );
  };

  clearData = () => {
    const { mapping, getCardFromMapping } = this.props;
    this.setState( getCardFromMapping( mapping ), () => this.update() );
  };

  displayField( name, field = null ) {
    const { mapping } = this.props;
    const { preview, sample } = this.state;
    if ( preview && sample ) {
      return this.parseField( name, field );
    }
    if ( name === 'added' ) {
      if ( field ) return `{ ${mapping.fields[field].name} }`;
      return '{ }';
    }
    if ( name === 'title' ) {
      return `{ ${collapseArr( mapping.nameFields )} }`;
    }
    return `{ ${collapseArr( mapping[`${name}Fields`] )} }`;
  }

  render() {
    const {
      added, dateSection, timeSection, additionalSection, locationSection, titleSection, preview, sample
    } = this.state;
    const { mapping } = this.props;

    return (
      <Fragment>
        <div className="iip-map-admin-screendoor-dragdrop">
          <Column title="Card Preview">
            <div className="iip-map-admin-card-preview-container">
              <div className="iip-map-admin-card-preview-sample">
                { sample !== false && (
                  <ConfigsToggle
                    toggled={ preview }
                    label="Show Sample Data?"
                    callback={ this.setSample }
                  />
                ) }
                { sample === false && (
                  <p className="iip-map-admin-card-preview-toggle-label has-error">
                    Error retrieving sample data.
                  </p>
                ) }
              </div>
              <div className="iip-map-ol-popup-preview" id="infowindow-1">
                { titleSection.toggled && (
                  <h1 id="firstHeading" className="iip-map-ol-popup-preview-header">
                    { `${titleSection.preTitle} ${this.displayField( 'title' )} ${titleSection.postTitle}` }
                  </h1>
                ) }
                <div id="bodyContent-1" className="iip-map-ol-popup-preview-body">
                  { dateSection.toggled && (
                    <Fragment>
                      <h3 className="iip-map-ol-popup-preview-header">{ dateSection.heading || '' }</h3>
                      <p>{ this.displayField( 'date' ) }</p>
                      { timeSection.toggled && (
                        <p>{ this.displayField( 'time' ) }</p>
                      ) }
                    </Fragment>
                  ) }
                  { locationSection.toggled && (
                    <Fragment>
                      <h3 className="iip-map-ol-popup-preview-header">{ locationSection.heading || '' }</h3>
                      <p>{ this.displayField( 'location' ) }</p>
                    </Fragment>
                  ) }
                  { added.length > 0 && added.map( ( item, idx ) => (
                    <Fragment key={ `addedDisplay${idx + 1}` }>
                      <h3 className="iip-map-ol-popup-preview-header">{ item.heading }</h3>
                      <p>
                        { `${item.inlinePre} ${this.displayField( 'added', item.field )} ${item.inlinePost}` }
                      </p>
                    </Fragment>
                  ) ) }
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
                  callback={ this.updateToggleState( 'titleSection' ) }
                >
                  <Fragment>
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
                  </Fragment>
                </ConfigsToggle>
                <ConfigsToggle
                  toggled={ dateSection.toggled }
                  label="Add Date?"
                  callback={ this.updateToggleState( 'dateSection' ) }
                >
                  <Fragment>
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
                    <ConfigsToggle
                      toggled={ timeSection.toggled }
                      label="Add Time?"
                      callback={ this.updateToggleState( 'timeSection' ) }
                    >
                      <Fragment>
                        <p className="iip-map-admin-card-preview-toggle-label" style={ { marginTop: '0' } }>Format:</p>
                        <label htmlFor="timeFormat-12">
                          12 hour
                          <input
                            className="iip-map-admin-project-input"
                            id="timeFormat-12"
                            data-group="timeSection"
                            name="timeFormat"
                            type="radio"
                            checked={ timeSection.timeFormat === '12hour' }
                            value="12hour"
                            onChange={ this.handleInput }
                          />
                        </label>
                        <label htmlFor="timeFormat-24">
                          24 hour
                          <input
                            className="iip-map-admin-project-input"
                            id="timeFormat-24"
                            data-group="timeSection"
                            name="timeFormat"
                            type="radio"
                            checked={ timeSection.timeFormat === '24hour' }
                            value="24hour"
                            onChange={ this.handleInput }
                          />
                        </label>
                      </Fragment>
                    </ConfigsToggle>
                  </Fragment>
                </ConfigsToggle>
                <ConfigsToggle
                  toggled={ locationSection.toggled }
                  label="Add Location?"
                  callback={ this.updateToggleState( 'locationSection' ) }
                >
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
                    const kgen = ( ...args ) => `${args.join( '' )}${position}`;
                    return (
                      <div className="iip-map-admin-card-preview-meta" key={ position }>
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
                        <label
                          className="iip-map-admin-label"
                          htmlFor="field"
                          key={ kgen( 'field' ) }
                        >
                              Choose field:
                          <select
                            className="iip-map-admin-project-input"
                            key={ kgen( 'fieldselect' ) }
                            data-group="added"
                            data-index={ index }
                            name="field"
                            value={ value.field }
                            onChange={ this.handleInput }
                          >
                            <option value="">Please select a field</option>
                            { mapping.additionalFields.map( ( item, i ) => (
                              <option
                                value={ item.field }
                                key={ kgen( 'fieldselectopt', i ) }
                              >
                                { item.name }
                              </option>
                            ) ) }
                          </select>
                        </label>
                        <label
                          className="iip-map-admin-label"
                          htmlFor="heading"
                          key={ kgen( 'heading' ) }
                        >
                              Section header (optional):
                          <input
                            className="iip-map-admin-project-input"
                            key={ kgen( 'heading', 'input' ) }
                            data-group="added"
                            data-index={ index }
                            name="heading"
                            type="text"
                            value={ value.heading }
                            onChange={ this.handleInput }
                          />
                        </label>
                        <label
                          className="iip-map-admin-label stacked"
                          htmlFor="inlinePre"
                          key={ kgen( 'inlinePre', '' ) }
                        >
                              Inline text before item (optional):
                          <textarea
                            className="iip-map-admin-project-textarea"
                            key={ kgen( 'inlinePre', 'text' ) }
                            data-group="added"
                            data-index={ index }
                            name="inlinePre"
                            value={ value.inlinePre }
                            onChange={ this.handleInput }
                          />
                        </label>
                        <label
                          className="iip-map-admin-label stacked"
                          key={ kgen( 'inlinePost', '' ) }
                          htmlFor="inlinePost"
                        >
                              Inline text after item (optional):
                          <textarea
                            className="iip-map-admin-project-textarea"
                            key={ kgen( 'inlinePost', 'text' ) }
                            data-group="added"
                            data-index={ index }
                            name="inlinePost"
                            value={ value.inlinePost }
                            onChange={ this.handleInput }
                          />
                        </label>
                      </div>
                    );
                  } ) }
                </div>
                ) }
              </div>
            </div>
          </Column>
        </div>
        <button type="button" onClick={ this.clearData }>
          Reset to Default Card
        </button>
      </Fragment>
    );
  }
}

ScreendoorConfigureCard.propTypes = {
  id: PropTypes.string,
  mapping: PropTypes.object,
  getCardFromMapping: PropTypes.func,
  setDirty: PropTypes.func,
  setCard: PropTypes.func,
  card: PropTypes.shape( {
    titleSection: PropTypes.shape( {
      preTitle: PropTypes.string,
      postTitle: PropTypes.string,
      toggled: PropTypes.bool
    } ),
    dateSection: PropTypes.shape( {
      toggled: PropTypes.bool,
      heading: PropTypes.string
    } ),
    timeSection: PropTypes.shape( {
      toggled: PropTypes.bool,
      timeFormat: PropTypes.string
    } ),
    locationSection: PropTypes.shape( {
      toggled: PropTypes.bool,
      heading: PropTypes.string
    } ),
    additionalSection: PropTypes.shape( {
      toggled: PropTypes.bool
    } ),
    added: PropTypes.arrayOf( PropTypes.shape( {
      heading: PropTypes.string,
      field: PropTypes.string,
      inlinePre: PropTypes.string,
      inlinePost: PropTypes.string
    } ) )
  } )
};

export default ScreendoorConfigureCard;
