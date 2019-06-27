import React from 'react';
import { object } from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

const ColumnItem = ( { data, index } ) => (
  <Draggable draggableId={ data.field } index={ index }>
    { provided => (
      <div
        className="iip-map-admin-column-item"
        ref={ provided.innerRef }
        { ...provided.draggableProps }
        { ...provided.dragHandleProps }
      >
        { data.name }
      </div>
    ) }
  </Draggable>
);

ColumnItem.propTypes = {
  data: object
};

export default ColumnItem;
