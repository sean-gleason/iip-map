import React, {
  Fragment, useEffect, useReducer, useState
} from 'react';
import * as PropTypes from 'prop-types';

import Column from '../../../Components/Column/Column';
import ConfigsToggle from '../../../Components/ConfigsToggle/ConfigsToggle';
import { collapseArr } from '../../../utils/helpers';
import TabControls from './TabControls';

const MapCard = ( {
  mapping, card, getCardFromMapping, getSample, doSave, doNext, setDirty, isDirty, needsUpdate, setUpdated
} ) => {
  const [cardState, setState] = useReducer(
    ( prevState, update ) => ( { ...prevState, ...update } ),
    card,
    initial => ( getCardFromMapping( mapping, initial ) )
  );
  const [sample, setSample] = useState( null );
  const [preview, setPreview] = useState( false );
  const [errors, setErrors] = useState( [] );

  const setCardState = val => setState( { ...cardState, ...val } );

  const handleAddArrayInput = ( group, ...args ) => {
    const obj = {};
    args.forEach( ( arg ) => {
      obj[arg] = '';
      return obj;
    } );

    setCardState( {
      [group]: [...cardState[group], obj]
    } );
  };

  const handleDeleteItem = ( e ) => {
    const { group, index } = e.target.dataset;
    const { [group]: stateGroup } = cardState;
    const obj = Object.assign( [], stateGroup );
    obj.splice( index, 1 );

    setCardState( {
      [group]: obj
    } );
  };

  const handleInput = ( e ) => {
    const { group } = e.target.dataset;
    const { [group]: stateGroup } = cardState;
    if ( group === 'added' ) {
      const { index } = e.target.dataset;
      stateGroup[index][e.target.name] = e.target.value;
    } else {
      stateGroup[e.target.name] = e.target.value;
    }

    setCardState( { [group]: stateGroup } );
  };

  const updateToggleState = section => ( e ) => {
    const { [section]: sectionState } = cardState;
    setCardState( {
      [section]: {
        ...sectionState,
        toggled: e
      }
    } );
    setDirty( true );
  };

  const handleSample = ( toggle ) => {
    if ( toggle && !sample ) {
      return getSample( mapping )
        .then( ( events ) => {
          setPreview( toggle );
          setSample( events[0] );
        } ).catch( () => {
          setPreview( false );
          setSample( false );
        } );
    }
    setPreview( toggle );
  };

  const handleSave = () => {
    doSave( cardState )
      .catch( ( err ) => {
        if ( err.error ) {
          setErrors( [`API Error: ${err.error}`] );
        } else {
          setErrors( [err.toString()] );
        }
      } );
  };

  const parseField = ( name, field = null ) => {
    const { timeSection } = cardState;
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

  const displayField = ( name, field = null ) => {
    if ( preview && sample ) {
      return parseField( name, field );
    }
    if ( name === 'added' ) {
      if ( field && field in mapping.fields ) return `{ ${mapping.fields[field].name} }`;
      return '{ }';
    }
    if ( name === 'title' ) {
      return `{ ${collapseArr( mapping.nameFields )} }`;
    }
    return `{ ${collapseArr( mapping[`${name}Fields`] )} }`;
  };

  const handleClear = () => {
    setCardState( getCardFromMapping( mapping ) );
  };

  const handleRevert = () => {
    setCardState( card );
    setDirty( false );
  };

  useEffect( () => {
    if ( needsUpdate ) {
      setState( card || getCardFromMapping( mapping, cardState ) );
      setUpdated();
    }
  }, [
    needsUpdate, card, mapping, cardState
  ] );

  useEffect( () => {
    if ( !card && !isDirty ) {
      setDirty( true );
    }
  }, [] );

  const {
    added, dateSection, timeSection, additionalSection, locationSection, titleSection
  } = cardState;
  return (
    <Fragment>
      <div className="react-tabs__tab-panel--inner">
        <div className="iip-map-admin-screendoor-dragdrop">
          <Column title="Card Preview">
            <div className="iip-map-admin-card-preview-container">
              <div className="iip-map-admin-card-preview-sample">
                { sample !== false && (
                <ConfigsToggle
                  toggled={ preview }
                  label="Show Sample Data?"
                  callback={ handleSample }
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
                  { `${titleSection.preTitle} ${displayField( 'title' )} ${titleSection.postTitle}` }
                </h1>
                ) }
                <div id="bodyContent-1" className="iip-map-ol-popup-preview-body">
                  { dateSection.toggled && (
                  <Fragment>
                    <h3 className="iip-map-ol-popup-preview-header">{ dateSection.heading || '' }</h3>
                    <p>{ displayField( 'date' ) }</p>
                    { timeSection.toggled && (
                      <p>{ displayField( 'time' ) }</p>
                    ) }
                  </Fragment>
                  ) }
                  { locationSection.toggled && (
                  <Fragment>
                    <h3 className="iip-map-ol-popup-preview-header">{ locationSection.heading || '' }</h3>
                    <p>{ displayField( 'location' ) }</p>
                  </Fragment>
                  ) }
                  { added.length > 0 && added.map( ( item, idx ) => (
                    <Fragment key={ `addedDisplay${idx + 1}` }>
                      <h3 className="iip-map-ol-popup-preview-header">{ item.heading }</h3>
                      <p>
                        { `${item.inlinePre} ${displayField( 'added', item.field )} ${item.inlinePost}` }
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
                  callback={ updateToggleState( 'titleSection' ) }
                >
                  <Fragment>
                    <label className="iip-map-admin-label" htmlFor="preTitle">
                    Add text before title?
                      <input
                        className="iip-map-admin-project-input"
                        data-group="titleSection"
                        name="preTitle"
                        onChange={ handleInput }
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
                        onChange={ handleInput }
                        type="text"
                        value={ titleSection.postTitle }
                      />
                    </label>
                  </Fragment>
                </ConfigsToggle>
                <ConfigsToggle
                  toggled={ dateSection.toggled }
                  label="Add Date?"
                  callback={ updateToggleState( 'dateSection' ) }
                >
                  <Fragment>
                    <label className="iip-map-admin-label" htmlFor="heading">
                    Section header (optional):
                      <input
                        className="iip-map-admin-project-input"
                        data-group="dateSection"
                        name="heading"
                        onChange={ handleInput }
                        type="text"
                        value={ dateSection.heading }
                      />
                    </label>
                    <ConfigsToggle
                      toggled={ timeSection.toggled }
                      label="Add Time?"
                      callback={ updateToggleState( 'timeSection' ) }
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
                            onChange={ handleInput }
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
                            onChange={ handleInput }
                          />
                        </label>
                      </Fragment>
                    </ConfigsToggle>
                  </Fragment>
                </ConfigsToggle>
                <ConfigsToggle
                  toggled={ locationSection.toggled }
                  label="Add Location?"
                  callback={ updateToggleState( 'locationSection' ) }
                >
                  <label className="iip-map-admin-label" htmlFor="heading">
                  Section header (optional):
                    <input
                      className="iip-map-admin-project-input"
                      data-group="locationSection"
                      name="heading"
                      onChange={ handleInput }
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
                        handleAddArrayInput( 'added', 'field', 'heading', 'inlinePre', 'inlinePost' );
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
                            onClick={ handleDeleteItem }
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
                            onChange={ handleInput }
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
                            onChange={ handleInput }
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
                            onChange={ handleInput }
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
                            onChange={ handleInput }
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
      </div>
      <TabControls handleSave={ handleSave } errors={ errors }>
        <button
          key="map-card-clear"
          className="button button-large"
          type="button"
          onClick={ handleClear }
        >
          Clear Card
        </button>
        <button
          key="map-card-revert"
          className="button button-large"
          type="button"
          disabled={ !isDirty || !card }
          onClick={ handleRevert }
        >
          Revert Changes
        </button>
        <button
          key="map-card-skip"
          className="button button-large"
          type="button"
          disabled={ isDirty || !card }
          onClick={ doNext }
        >
          Skip
        </button>
      </TabControls>
    </Fragment>
  );
};

MapCard.propTypes = {
  isDirty: PropTypes.bool,
  needsUpdate: PropTypes.bool,
  mapping: PropTypes.object,
  setDirty: PropTypes.func,
  setUpdated: PropTypes.func,
  getSample: PropTypes.func,
  getCardFromMapping: PropTypes.func,
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
  } ),
  doNext: PropTypes.func,
  doSave: PropTypes.func
};

export default MapCard;
