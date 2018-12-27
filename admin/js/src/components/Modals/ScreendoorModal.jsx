import React, { Component } from 'react';
import { array } from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';

import Column from '../Column/Column';

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
    const { fields, availableFields } = this.state;

    if ( !destination ) {
      return;
    }

    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) {
      return;
    }

    const newInputs = Array.from( availableFields );
    newInputs.splice( source.index, 1 );
    newInputs.splice( destination.index, 0, fields[draggableId] );

    this.setState( {
      availableFields: newInputs
    } );
  }

  render() {
    const { availableFields, mappedFields } = this.state;

    return (
      <div className="iip-map-admin-screendoor-modal">
        <DragDropContext onDragEnd={ this.onDragEnd }>
          <Column data={ availableFields } id="screendoor-input" title="Available Fields" />
          <Column data={ mappedFields } id="screendoor-mapped" title="Map To:" />
        </DragDropContext>
      </div>
    );
  }
}

ScreendoorModal.propTypes = {
  data: array
};

export default ScreendoorModal;
