import React from 'react';
import { array, bool, string } from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';

import InnerList from './InnerList';

const ItemGroup = ( {
  data, id, required, title
} ) => (
  <div className="iip-map-admin-column-item-group">
    <div className="iip-map-admin-column-item-group-container">
      { title && (
        <strong data-required={ required }>{ title }</strong>
      ) }
      <Droppable droppableId={ id }>
        { provided => (
          <div
            className="iip-map-admin-column-list"
            ref={ provided.innerRef }
            { ...provided.droppableProps }
          >
            <InnerList data={ data } />
            { provided.placeholder }
          </div>
        ) }
      </Droppable>
    </div>
  </div>
);

ItemGroup.propTypes = {
  data: array,
  id: string,
  required: bool,
  title: string
};

ItemGroup.defaultProps = {
  required: false
};

export default ItemGroup;
