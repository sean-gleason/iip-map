import React, { Fragment } from 'react';
import {
  array, bool, string, func
} from 'prop-types';

import ItemGroup from './ItemGroup';

const ItemGroupSelect = ( props ) => {
  const {
    data, selected, hasError, handleTopic
  } = props;

  const maxVisible = 10;
  const lines = ( data.length > maxVisible ? maxVisible : data.length );

  const handleSelect = ( e ) => {
    handleTopic( [...e.target.selectedOptions].map( o => o.value ) );
  };

  return (
    <ItemGroup { ...props }>
      <Fragment>
        <div className="iip-map-admin-column-item__select">
          <select
            multiple
            name="topicFields"
            style={ {
              height: `calc(${lines} * 1.35em)`
            } }
            className={ hasError ? 'invalid' : '' }
            value={ selected.map( f => f.field ) }
            onChange={ handleSelect }
          >
            { data.map( field => (
              <option value={ field.field } key={ `topic-option-${field.field}` }>
                { field.name }
              </option>
            ) ) }
          </select>
        </div>
      </Fragment>
    </ItemGroup>
  );
};

ItemGroupSelect.propTypes = {
  handleTopic: func,
  data: array,
  selected: array,
  id: string,
  required: bool,
  hasError: bool,
  title: string,
  subtext: string
};

ItemGroupSelect.defaultProps = {
  required: false
};

export default ItemGroupSelect;
