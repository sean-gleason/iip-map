import React from 'react';
import { array, string } from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';

import ColumnItem from './ColumnItem';

const Column = ( { data, id, title } ) => (
  <div className="iip-map-admin-column-container">
    <h3 className="iip-map-admin-column-title">{ title }</h3>
    <Droppable droppableId={ id }>
      { provided => (
        <div
          className="iip-map-admin-column-list"
          ref={ provided.innerRef }
          { ...provided.droppableProps }
        >
          { data.map( ( item, index ) => (
            <ColumnItem data={ item } index={ index } key={ item.field } />
          ) ) }
          { provided.placeholder }
        </div>
      ) }
    </Droppable>
  </div>
);

Column.propTypes = {
  data: array,
  id: string,
  title: string
};

export default Column;
