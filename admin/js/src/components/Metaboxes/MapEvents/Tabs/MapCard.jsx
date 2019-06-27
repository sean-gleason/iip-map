import React, {
  Fragment, useEffect, useReducer, useState
} from 'react';
import * as PropTypes from 'prop-types';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from '../../../Column/Column';
import ConfigsToggle from '../../../ConfigsToggle/ConfigsToggle';
import { collapseArr } from '../../../../utils/helpers';
import TabControls from './TabControls';
import MapCardAdditional from './MapCardAdditional';


const MapCard = ( {
  mapping, card, getCardFromMapping, getSample, doSave, doNext,
  setDirty, isDirty, needsUpdate, setUpdated, publishReminder
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
    } );

    const dragIds = cardState[group].reduce( ( arr, val ) => {
      if ( 'dragId' in val ) arr.push( val.dragId );
      return arr;
    }, [] );

    do {
      obj.dragId = Math.round( Math.random() * 1000 );
    } while ( dragIds.includes( obj.dragId ) );

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

  const onDragEnd = ( result ) => {
    // dropped outside the list
    if ( !result.destination ) {
      return;
    }
    const items = Array.from( cardState.added );
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    const [removed] = items.splice( startIndex, 1 );
    items.splice( endIndex, 0, removed );

    setCardState( {
      added: items
    } );
    setDirty( true );
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
                  { additionalSection.toggled && added.length > 0 && added.map( ( item, idx ) => (
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
                <ConfigsToggle
                  toggled={ additionalSection.toggled }
                  label="Additional Sections?"
                  callback={ updateToggleState( 'additionalSection' ) }
                />
                { additionalSection.toggled && (
                  <div className="iip-map-admin-card-preview-option iip-map-admin-card-additional">
                    <DragDropContext onDragEnd={ onDragEnd }>
                      <Droppable droppableId="customSections">
                        { provided => (
                          <div
                            className="iip-map-admin-column-list"
                            ref={ provided.innerRef }
                            { ...provided.droppableProps }
                          >
                            { added.map( ( value, index ) => {
                              const position = index + 1;
                              const kgen = ( ...args ) => `${args.join( '' )}${position}`;
                              return (
                                <MapCardAdditional
                                  key={ kgen( 'additionalSec' ) }
                                  position={ position }
                                  value={ value }
                                  index={ index }
                                  kgen={ kgen }
                                  handleInput={ handleInput }
                                  handleDeleteItem={ handleDeleteItem }
                                  mapping={ mapping }
                                />
                              );
                            } ) }
                            { provided.placeholder }
                          </div>
                        ) }
                      </Droppable>
                    </DragDropContext>
                    <div className="iip-map-admin-card-preview-option-top iip-map-admin-column-item">
                      <p className="iip-map-admin-card-preview-toggle-label" style={ { margin: 0 } }>Add Section?</p>
                      <button
                        type="button"
                        onClick={ () => {
                          handleAddArrayInput( 'added', 'field', 'heading', 'inlinePre', 'inlinePost' );
                        } }
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) }
              </div>
            </div>
          </Column>
        </div>
      </div>
      <TabControls handleSave={ handleSave } errors={ errors } publishReminder={ publishReminder }>
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
  publishReminder: PropTypes.bool,
  doNext: PropTypes.func,
  doSave: PropTypes.func
};

export default MapCard;
