import React, { Fragment } from 'react';
import { array, bool, string } from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';

import InnerList from './InnerList';
import ItemGroup from './ItemGroup';

const ItemGroupDroppable = ( props ) => {
  const { data, id, subtext } = props;
  return (
    <ItemGroup { ...props }>
      <Fragment>
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
        { !!subtext && (
          <div>{ subtext }</div>
        ) }
      </Fragment>
    </ItemGroup>
  );
};

ItemGroupDroppable.propTypes = {
  data: array,
  id: string,
  required: bool,
  hasError: bool,
  title: string,
  subtext: string
};

ItemGroupDroppable.defaultProps = {
  required: false
};

export default ItemGroupDroppable;
