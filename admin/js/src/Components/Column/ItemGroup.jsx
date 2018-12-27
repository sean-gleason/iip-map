import React from 'react';
import { array, string } from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';

import ColumnItem from './ColumnItem';

const ItemGroup = ( { data, id } ) => (
  <div className="iip-map-admin-column-item-group">
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

ItemGroup.propTypes = {
  data: array,
  id: string
};

export default ItemGroup;
