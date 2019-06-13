import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import equal from 'fast-deep-equal';
import { DragDropContext } from 'react-beautiful-dnd';

import Column from '../../Components/Column/Column';
import ItemGroup from '../../Components/Column/ItemGroup';

class ScreendoorFieldMapper extends Component {
  constructor( props ) {
    super( props );
    const { getMapping } = props;
    this.state = getMapping();
  }

  componentWillReceiveProps( nextProps, nextContext ) {
    const { form } = this.props;
    // You don't have to do this check first, but it can help prevent an unneeded render
    if ( !equal( form, nextProps.form ) ) {
      this.setStateData( nextProps.form );
    }
  }

  setStateData( data, callback = () => null ) {
    const fields = this.getDraggableFields( data );
    const availableFields = Array.from( data );

    this.setState( {
      fields,
      availableFields,
      additionalFields: [],
      dateFields: [],
      locationFields: [],
      nameFields: [],
      timeFields: []
    }, callback );
  }

  onDragEnd = ( result ) => {
    const { setDirty } = this.props;
    const { destination, draggableId, source } = result;
    const { fields } = this.state;

    if ( !destination ) {
      return;
    }

    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) {
      return;
    }

    const startGroup = source.droppableId;
    const endGroup = destination.droppableId;

    if ( startGroup === endGroup ) {
      const { [startGroup]: start } = this.state;

      const newOrder = Array.from( start );
      newOrder.splice( source.index, 1 );
      newOrder.splice( destination.index, 0, fields[draggableId] );

      this.setState( {
        [startGroup]: newOrder
      }, () => this.updateFields() );
    }

    if ( startGroup !== endGroup ) {
      const { [startGroup]: start } = this.state;
      const { [endGroup]: end } = this.state;

      const removeFromColumn = Array.from( start );
      const addToColumn = Array.from( end );

      removeFromColumn.splice( source.index, 1 );
      addToColumn.splice( destination.index, 0, fields[draggableId] );

      this.setState( {
        [startGroup]: removeFromColumn,
        [endGroup]: addToColumn
      }, () => this.updateFields() );
    }
    setDirty( true );
  };

  getDraggableFields = ( data ) => {
    const fields = {};

    data.forEach( ( item ) => {
      fields[item.field] = { ...item };
    } );

    return fields;
  };

  resetMap = () => {
    const { form, reset } = this.props;
    this.setStateData( form, () => {
      reset( this.state );
    } );
  };

  updateFields() {
    const { setMapping } = this.props;
    setMapping( { ...this.state } );
  }

  render() {
    const { errors } = this.props;
    const {
      additionalFields, availableFields, dateFields, locationFields, nameFields, timeFields
    } = this.state;

    return (
      <Fragment>
        <div className="iip-map-admin-screendoor-dragdrop">
          <DragDropContext onDragEnd={ this.onDragEnd }>
            <Column title="Available Fields">
              <ItemGroup data={ availableFields } id="availableFields" />
            </Column>
            <Column title="Map To:">
              <ItemGroup
                required
                data={ nameFields }
                id="nameFields"
                title="Item Name:"
                hasError={ errors.includes( 'name' ) }
              />
              <ItemGroup
                required
                data={ locationFields }
                id="locationFields"
                title="Location:"
                hasError={ errors.includes( 'location' ) }
              />
              <ItemGroup data={ dateFields } id="dateFields" title="Date:" />
              <ItemGroup data={ timeFields } id="timeFields" title="Time:" />
              <ItemGroup data={ additionalFields } id="additionalFields" title="Additional Data:" />
            </Column>
          </DragDropContext>
        </div>
        <button type="button" onClick={ this.resetMap }>
          Clear Mapping
        </button>
      </Fragment>
    );
  }
}

ScreendoorFieldMapper.propTypes = {
  form: PropTypes.array,
  reset: PropTypes.func,
  errors: PropTypes.arrayOf( PropTypes.string ),
  setDirty: PropTypes.func,
  setMapping: PropTypes.func,
  getMapping: PropTypes.func
};

export default ScreendoorFieldMapper;
