import React, { Component } from 'react';
import { array } from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';

import Column from '../Column/Column';
import ItemGroup from '../Column/ItemGroup';

class ScreendoorModal extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      fields: {},
      availableFields: [],
      mappedFields: []
    };

    this.onDragEnd = this.onDragEnd.bind( this );
  }

  componentDidUpdate( prevProps ) {
    const { data } = this.props;

    const fields = {};

    data.forEach( ( item ) => {
      fields[item.field] = {
        field: item.field,
        name: item.name
      };
    } );

    const availableFields = Array.from( data );

    if ( data !== prevProps.data ) {
      this.setState( {
        fields,
        availableFields
      } );
    }
  }

  onDragEnd( result ) {
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

    const startColumn = source.droppableId;
    const endColumn = destination.droppableId;

    if ( startColumn === endColumn ) {
      const newOrder = Array.from( this.state[startColumn] );
      newOrder.splice( source.index, 1 );
      newOrder.splice( destination.index, 0, fields[draggableId] );

      this.setState( {
        [startColumn]: newOrder
      } );
    }

    if ( startColumn !== endColumn ) {
      const removeFromColumn = Array.from( this.state[startColumn] );
      const addToColumn = Array.from( this.state[endColumn] );

      removeFromColumn.splice( source.index, 1 );
      addToColumn.splice( destination.index, 0, fields[draggableId] );

      this.setState( {
        [startColumn]: removeFromColumn,
        [endColumn]: addToColumn
      } );
    }
  }

  render() {
    const { availableFields, mappedFields } = this.state;

    return (
      <div className="iip-map-admin-screendoor-modal">
        <DragDropContext onDragEnd={ this.onDragEnd }>
          <Column title="Available Fields">
            <ItemGroup data={ availableFields } id="availableFields" />
          </Column>
          <Column title="Map To:">
            <ItemGroup data={ mappedFields } id="mappedFields" />
          </Column>
        </DragDropContext>
      </div>
    );
  }
}

ScreendoorModal.propTypes = {
  data: array
};

export default ScreendoorModal;
